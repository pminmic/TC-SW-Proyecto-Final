use crate::config::{State, SIM_SPEED};
use crate::config::{AFTER_BOOSTER_VELOCITY, BEFORE_BOOSTER_VELOCITY, BRAKE_FORCE, MAX_CURRENT_A};
use iso8601_timestamp::Timestamp;
use std::f32::consts::PI;
use std::sync::Arc;
use tokio::{
    sync::Mutex,
    time::{interval, Duration}
};

// The tick duration is 0.25 seconds, so we multiply the SIM_SPEED by 0.25 to get the correct position update per tick
const SIM_TICK_MS: f32 = SIM_SPEED * 0.25;

pub type SharedSim = Arc<Mutex<Simulator>>;
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

    pub async fn run(sim: SharedSim) {
        let mut tick = interval(Duration::from_millis(250));
        loop {
            tick.tick().await;

            let mut s = sim.lock().await;
            
            // Simulator logic based on the current state
            s.update_timestamp();
            match s.state {
                State::Precharge => s.precharge(),
                State::Running => s.running(),
                State::Boosting => s.boosting(),
                State::Braking => s.braking(),
                _ => (),
            }
            s.log();
        }
    }

    fn update_timestamp(&mut self) {
        self.timestamp = Timestamp::now_utc()
    }

    // Logs the current state and parameters of the simulator (just temporally for debugging purposes)
    fn log(&self) {
        println!(
            "Timestamp: {}, State: {:?}, Position: {:.2} m, Velocity: {:.2} km/h, Acceleration: {:.2} m/s², Voltage: {:.2} V, Current: {:.2} A",
            self.timestamp, &self.state, self.position_m, self.velocity_kmh, self.acceleration_ms2, self.voltage_v, self.current_a
        );
    }

    // Resets all the simulator parameters to their initial values
    pub fn reset(&mut self) {
        self.position_m = 0.0;
        self.velocity_kmh = 0.0;
        self.acceleration_ms2 = 0.0;
        self.voltage_v = 0.0;
        self.current_a = 0.0;
        self.state = State::Idle;
        self.timestamp = Timestamp::now_utc();
    }

    // Will be called every tick when the state is Precharge
    fn precharge(&mut self) {
        if self.voltage_v == 400.0 {
            self.state = State::Ready;
        }

        if self.state.eq(&State::Precharge) {
            self.voltage_v += 25.0 * SIM_SPEED; // Increase per tick
        }
    }

    // Will be called every tick when the state is Running
    fn running(&mut self) {
        if self.position_m < 2.0 {
            self.velocity_kmh = BEFORE_BOOSTER_VELOCITY;
            self.acceleration_ms2 = 0.0;

            // Update position based on the tick frequency (0.25 seconds)
            self.position_m += (self.velocity_kmh / 3.6) * SIM_TICK_MS;
        } else if self.position_m >= 2.0 && self.position_m < 4.0 {
            self.set_state(State::Boosting);
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
        }
    }

    fn boosting(&mut self) {
        if self.position_m >= 2.0 && self.position_m < 4.0 {
            let vel_f_ms = AFTER_BOOSTER_VELOCITY / 3.6;
            let vel_o_ms = self.velocity_kmh / 3.6;

            self.acceleration_ms2 = (vel_f_ms.powf(2.0)
                - vel_o_ms.powf(2.0))
                / (2.0 * (4.0 - self.position_m));

            let acceleration_kmh2 = self.acceleration_ms2 * 3.6;
            self.velocity_kmh += acceleration_kmh2 * SIM_TICK_MS;

            let vel_o_ms = self.velocity_kmh / 3.6;
            self.position_m += vel_o_ms * SIM_TICK_MS;
            self.current_a = MAX_CURRENT_A * ((PI * (self.position_m - 2.0) / 2.0).sin() as f32);
        } else {
            self.set_state(State::Running);
        }
    }

    fn braking(&mut self) {
        self.acceleration_ms2 = -BRAKE_FORCE / self.mass_kg;
        self.velocity_kmh += (self.acceleration_ms2 * 3.6) * SIM_TICK_MS;
        self.position_m += (self.velocity_kmh / 3.6) * SIM_TICK_MS;
        if self.velocity_kmh <= 0.0 {
            self.velocity_kmh = 0.0;
            self.acceleration_ms2 = 0.0;
            self.state = State::Stopped;
        }
        
        if self.position_m >= 50.0 {
            self.position_m = 50.0;
            self.velocity_kmh = 0.0;
            self.acceleration_ms2 = 0.0;
            self.state = State::Crashed;
        }
    }

    // We borrow the state to avoid unnecessary cloning, since State is a simple enum
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

