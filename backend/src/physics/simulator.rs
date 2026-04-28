use crate::config::{AFTER_BOOSTER_VELOCITY, BEFORE_BOOSTER_VELOCITY, BRAKE_FORCE, MAX_CURRENT_A};
use iso8601_timestamp::Timestamp;
use std::f32::consts::PI;
use crate::config::State;

struct Simulator {
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
    fn new() -> Self {
        Simulator {
            position_m: 0.0,
            velocity_kmh: 0.0,
            acceleration_ms2: 0.0,
            mass_kg: 0.0,
            voltage_v: 0.0,
            current_a: 0.0,
            state: State::Idle,
            timestamp: Timestamp::now(),
        }
    }

    fn reset(&mut self) {
        self.position_m = 0.0;
        self.velocity_kmh = 0.0;
        self.acceleration_ms2 = 0.0;
        self.voltage_v = 0.0;
        self.current_a = 0.0;
        self.state = State::Idle;
        self.timestamp = Timestamp::now();
    }

    // Will be called every tick when the state is Precharge
    fn precharge(&mut self) {
        self.timestamp = Timestamp::now();
        if self.state == State::Idle || self.state == State::Precharge {
            self.voltage_v += 25.0; // Increase per tick
            self.timestamp = Timestamp::now();
            if self.state == State::Idle {
                self.state = State::Precharge;
            }
        }

        if self.voltage_v == 400.0 {
            self.state = State::Ready;
        }
    }

    fn set_mass(&mut self, mass_kg: f32) {
        self.mass_kg = mass_kg;
    }

    fn is_ready(&self) -> bool {
        self.state == State::Ready && self.mass_kg > 0.0
    }

    // Will be called every tick when the state is Running
    fn running(&mut self) {
        self.timestamp = Timestamp::now();
        if self.position_m < 2.0 {
            self.velocity_kmh = BEFORE_BOOSTER_VELOCITY;
            self.position_m += self.velocity_kmh / 3.6;
        }

        if self.position_m >= 4.0 {
            self.velocity_kmh = AFTER_BOOSTER_VELOCITY;
            self.position_m += self.velocity_kmh / 3.6;
            self.current_a = 0.0; // No current after booster phase
        }

        if self.position_m >= 50.0 {
            self.position_m = 50.0;
            self.velocity_kmh = 0.0;
            self.state = State::Stopped;
        }
    }

    fn boost(&mut self) {
        self.timestamp = Timestamp::now();
        self.state = State::Boosting;
        if (self.position_m >= 2.0 && self.position_m < 4.0) {
            self.acceleration_ms2 = (AFTER_BOOSTER_VELOCITY.powf(2.0)
                - BEFORE_BOOSTER_VELOCITY.powf(2.0))
                / (2.0 * (4.0 - self.position_m));
            self.velocity_kmh += self.acceleration_ms2;
            self.position_m += self.velocity_kmh / 3.6;
            self.current_a = MAX_CURRENT_A * (( * (self.position_m - 2.0) / 2.0).sin() as f32);
        }
    }

    fn brake(&mut self) {
        self.timestamp = Timestamp::now();
        self.state = State::Braking;
        if (self.velocity_kmh == 0.0) {
            self.state = State::Stopped;
        } else {
            self.acceleration_ms2 = -BRAKE_FORCE / self.mass_kg;
            self.velocity_kmh += self.acceleration_ms2;
            self.position_m += self.velocity_kmh / 3.6;
            if (velocity_kmh < 0.0) {
                self.velocity_kmh = 0.0;
                self.state = State::Stopped;
            }
        }
    }

    fn stopped(&mut self) {
        self.timestamp = Timestamp::now();
        if (self.state == State::Stopped) {
            self.velocity_kmh = 0.0;
            self.acceleration_ms2 = 0.0;
            self.current_a = 0.0;
        }
    }

    fn get_state(&self) -> &State {
        &self.state
    }
}