use axum::{
    Json,
    extract::State
};
use crate::config::State as SimState;
use serde::Deserialize;
use crate::config::AppState;

#[derive(Deserialize, Debug)]
pub struct PrechargePayload {
    mass: f32
}

#[derive(Deserialize, Debug)]
#[serde(tag = "command", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Command {
    Start  {
        payload: PrechargePayload
    },
    Precharge,
    Brake,
    Reset
}

pub async fn command(State(sim): State<AppState>, Json(cmd): Json<Command>) {

    let mut s = sim.sim.lock().await;
    match cmd {
        Command::Precharge => {
            if s.get_state().eq(&SimState::Idle) {
                s.set_state(SimState::Precharge);
                println!("Se ha pulsado PRECHARGE");
            }
            else {
                println!("Error: PRECHARGE solo se puede pulsar desde el estado IDLE");
            }
        },
        Command::Start { payload } => {
            if s.get_state().eq(&SimState::Ready) {
                s.set_mass(payload.mass);
                s.set_state(SimState::Running);
                println!("Se ha pulsado START con payload: {:?}", payload.mass);

            }
            else {
                println!("Error: START solo se puede pulsar desde el estado READY");
            }
        }
        Command::Brake => {
            if s.get_state().eq(&SimState::Running) || s.get_state().eq(&SimState::Boosting) {
                s.set_state(SimState::Braking);
                println!("Se ha pulsado BRAKE");
            }
            else {
                println!("Error: BRAKE solo se puede pulsar desde los estados RUNNING o BOOSTING");
            }
        }
        Command::Reset => {
            s.reset();
            println!("Se ha pulsado RESET");
        }
    }
}