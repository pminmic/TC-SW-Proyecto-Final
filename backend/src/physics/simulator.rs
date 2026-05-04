use crate::config::{
    AFTER_BOOSTER_VELOCITY, BEFORE_BOOSTER_VELOCITY, BRAKE_FORCE, MAX_CURRENT_A, SIM_SPEED, State,
};
use crate::models::message::{MessageContent, WsMessage};
use iso8601_timestamp::Timestamp;
use serde::Serialize;
use std::f32::consts::PI;
use std::sync::Arc;
use tokio::{
    sync::{Mutex, broadcast},
    time::{Duration, interval},
};

// The tick duration is 0.25 seconds, so we multiply the SIM_SPEED by 0.25 to get the correct position update per tick
const SIM_TICK_MS: f32 = SIM_SPEED * 0.25;

// Type alias for a shared simulator instance wrapped in an Arc and Mutex for thread-safe access across async tasks
pub type SharedSim = Arc<Mutex<Simulator>>;

#[derive(Serialize, Clone)]
pub struct SimSnapshot {
    pub position_m: f32,
    pub velocity_kmh: f32,
    pub acceleration_ms2: f32,
    pub voltage_v: f32,
    pub current_a: f32,
    pub mass_kg: f32,
    pub state: String,
    pub timestamp: String,
}

// The Simulator struct holds all the parameters and state of the simulation, and contains methods to update its state based on the current conditions
pub struct Simulator {
    position_m: f32,
    velocity_kmh: f32,
    acceleration_ms2: f32,
    mass_kg: f32,
    voltage_v: f32,
    current_a: f32,
    state: State,
    timestamp: Timestamp,
}

impl Simulator {
    pub fn new() -> Self {
        Simulator {
            position_m: 0.0,
            velocity_kmh: 0.0,
            acceleration_ms2: 0.0,
            mass_kg: 0.0,
            voltage_v: 0.0,
            current_a: 0.0,
            state: State::Idle,
            timestamp: Timestamp::now_utc(),
        }
    }

    pub async fn run(
        sim: SharedSim,
        data: broadcast::Sender<SimSnapshot>,
        message: broadcast::Sender<WsMessage>,
    ) {
        let mut tick = interval(Duration::from_millis(250));
        loop {
            tick.tick().await;

            let mut s = sim.lock().await;

            // Simulator logic based on the current state
            s.update_timestamp();


            let mut msg: Option<MessageContent> = None;

            match s.state {
                State::Precharge => msg = s.precharge(),
                State::Running => msg = s.running(),
                State::Boosting => msg = s.boosting(),
                State::Braking => msg = s.braking(),
                _ => msg = None,
            }
            
            // TEMPORAL LOGGING
            // s.log();

            // Sends via ws the current data of the simulator
            data.send(s.snapshot()).ok();

            // If there's an info message to be sent to the clients, we send it via WebSocket
            if let Some(m) = msg {
                let info: WsMessage = WsMessage {
                    topic: "message".to_string(),
                    payload: m,
                };

                message.send(info).ok();
            }
        }
    }

    // Creates a snapshot of the current simulator state to be sent to the clients via WebSocket
    pub fn snapshot(&self) -> SimSnapshot {
        SimSnapshot {
            position_m: self.position_m,
            velocity_kmh: self.velocity_kmh,
            acceleration_ms2: self.acceleration_ms2,
            voltage_v: self.voltage_v,
            current_a: self.current_a,
            mass_kg: self.mass_kg,
            state: format!("{:?}", self.state),
            timestamp: self.timestamp.to_string(),
        }
    }

    fn update_timestamp(&mut self) {
        self.timestamp = Timestamp::now_utc()
    }

    // Logs the current state and parameters of the simulator (just temporally for debugging purposes)
    // fn log(&self) {
    //     println!(
    //         "Timestamp: {}, State: {:?}, Position: {:.2} m, Velocity: {:.2} km/h, Acceleration: {:.2} m/s², Voltage: {:.2} V, Current: {:.2} A",
    //         self.timestamp,
    //         &self.state,
    //         self.position_m,
    //         self.velocity_kmh,
    //         self.acceleration_ms2,
    //         self.mass_kg,
    //         self.voltage_v,
    //         self.current_a
    //     );
    // }

    pub fn inform(&self) -> Option<MessageContent> {
        let (t, cont) = match self.state {
            // Reset
            State::Idle => ("info".to_string(), "System reset".to_string()),
            State::Precharge => ("info".to_string(), "Prechange started".to_string()),
            State::Ready => (
                "success".to_string(),
                "V = 400V precharge completed successfully".to_string(),
            ),
            State::Running => {
                if self.position_m < 2.0 {
                    (
                        "info".to_string(),
                        format!("Booster test started. Mass: {} kg", self.mass_kg),
                    )
                } else if self.position_m >= 4.0 {
                    (
                        "success".to_string(),
                        "Boost completed. Velocity: 25km/h".to_string(),
                    )
                } else {
                    return None;
                }
            }
            State::Boosting => ("info".to_string(), "Booster section entered".to_string()),
            State::Braking => ("info".to_string(), "Braking initiated".to_string()),
            State::Crashed => (
                "critical".to_string(),
                "Cart reached mechanical stopper at s = 50 m".to_string(),
            ),
            State::Stopped => (
                "success".to_string(),
                format!("Cart stopped at s =  {:.2} m", self.position_m),
            ),
        };

        Some(MessageContent {
            r#type: t,
            content: cont,
        })
    }

    // Resets all the simulator parameters to their initial values
    pub fn reset(&mut self) -> Option<MessageContent> {
        self.position_m = 0.0;
        self.velocity_kmh = 0.0;
        self.acceleration_ms2 = 0.0;
        self.voltage_v = 0.0;
        self.mass_kg = 0.0;
        self.current_a = 0.0;
        self.state = State::Idle;
        self.timestamp = Timestamp::now_utc();

        // Return info message
        self.inform()
    }

    // Will be called every tick when the state is Precharge
    fn precharge(&mut self) -> Option<MessageContent> {
        if self.voltage_v == 400.0 {
            self.state = State::Ready;

            // Info message to be sent to the clients via WebSocket when precharge is completed
            return self.inform();
        } else if self.state.eq(&State::Precharge) {
            self.voltage_v += 25.0 * SIM_SPEED; // Increase per tick
        }
        None
    }

    // Will be called every tick when the state is Running
    fn running(&mut self) -> Option<MessageContent> {
        if self.position_m < 2.0 {
            self.velocity_kmh = BEFORE_BOOSTER_VELOCITY;
            self.acceleration_ms2 = 0.0;

            // Update position based on the tick frequency (0.25 seconds)
            self.position_m += (self.velocity_kmh / 3.6) * SIM_TICK_MS;
        } else if self.position_m >= 2.0 && self.position_m < 4.0 {
            self.set_state(State::Boosting);
            return self.inform();
        } else if self.position_m >= 4.0 {
            self.velocity_kmh = AFTER_BOOSTER_VELOCITY;
            self.acceleration_ms2 = 0.0;

            // Update position based on the tick frequency (0.25 seconds)
            self.position_m += (self.velocity_kmh / 3.6) * SIM_TICK_MS;
            self.current_a = 0.0; // No current after booster phase
        }

        if self.position_m >= 50.0 {
            self.position_m = 50.0;
            self.velocity_kmh = 0.0;
            self.acceleration_ms2 = 0.0;
            self.state = State::Crashed;
            return self.inform();
        }
        None
    }

    fn boosting(&mut self) -> Option<MessageContent> {
        if self.position_m >= 2.0 && self.position_m < 4.0 {
            let vel_f_ms = AFTER_BOOSTER_VELOCITY / 3.6;
            let vel_o_ms = self.velocity_kmh / 3.6;

            self.acceleration_ms2 =
                (vel_f_ms.powf(2.0) - vel_o_ms.powf(2.0)) / (2.0 * (4.0 - self.position_m));

            let acceleration_kmh2 = self.acceleration_ms2 * 3.6;
            self.velocity_kmh += acceleration_kmh2 * SIM_TICK_MS;

            let vel_o_ms = self.velocity_kmh / 3.6;
            self.position_m += vel_o_ms * SIM_TICK_MS;
            self.current_a = MAX_CURRENT_A * ((PI * (self.position_m - 2.0) / 2.0).sin() as f32);
        } else {
            self.set_state(State::Running);
            return self.inform();
        }
        None
    }

    fn braking(&mut self) -> Option<MessageContent> {
        self.acceleration_ms2 = -BRAKE_FORCE / self.mass_kg;
        self.velocity_kmh += (self.acceleration_ms2 * 3.6) * SIM_TICK_MS;
        self.position_m += (self.velocity_kmh / 3.6) * SIM_TICK_MS;
        if self.velocity_kmh <= 0.0 {
            self.velocity_kmh = 0.0;
            self.acceleration_ms2 = 0.0;
            self.state = State::Stopped;
            return self.inform();
        }

        if self.position_m >= 50.0 {
            self.position_m = 50.0;
            self.velocity_kmh = 0.0;
            self.acceleration_ms2 = 0.0;
            self.state = State::Crashed;
            return self.inform();
        }
        None
    }

    // Return a reference to avoid unnecessary cloning.
    pub fn get_state(&self) -> &State {
        &self.state
    }

    pub fn set_state(&mut self, state: State) {
        self.state = state;
    }

    pub fn get_position(&self) -> f32 {
        self.position_m
    }

    pub fn get_velocity(&self) -> f32 {
        self.velocity_kmh
    }

    pub fn get_acceleration(&self) -> f32 {
        self.acceleration_ms2
    }

    pub fn get_voltage(&self) -> f32 {
        self.voltage_v
    }

    pub fn get_current(&self) -> f32 {
        self.current_a
    }

    pub fn get_timestamp(&self) -> Timestamp {
        self.timestamp
    }

    pub fn set_mass(&mut self, mass: f32) {
        self.mass_kg = mass;
    }

    pub fn get_mass(&self) -> f32 {
        self.mass_kg
    }
}
