use crate::models::message::WsMessage;
use crate::physics::simulator::{SharedSim, SimSnapshot};
use tokio::sync::broadcast;

pub const SIM_SPEED: f32 = 0.2;
pub const AFTER_BOOSTER_VELOCITY: f32 = 25.0; // In km/h
pub const BRAKE_FORCE: f32 = 196.0; // Newtons
pub const BEFORE_BOOSTER_VELOCITY: f32 = 4.0; // In km/h
pub const MAX_CURRENT_A: f32 = 200.0; // In Amperes

#[derive(Debug, PartialEq)]
pub enum State {
    Idle,
    Precharge,
    Ready,
    Running,
    Boosting,
    Braking,
    Stopped,
    Crashed,
}

#[derive(Clone)]
pub struct AppState {
    pub sim: SharedSim,
    pub data: broadcast::Sender<SimSnapshot>,
    pub message: broadcast::Sender<WsMessage>,
}
