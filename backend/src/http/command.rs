use crate::{
    config::{AppState, State as SimState},
    models::message::{MessageContent, WsMessage},
};
use axum::{
    Json,
    extract::State,
};
use serde::Deserialize;

#[derive(Deserialize, Debug)]
pub struct PrechargePayload {
    mass: f32,
}

#[derive(Deserialize, Debug)]
#[serde(tag = "command", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Command {
    Start { payload: PrechargePayload },
    Precharge,
    Brake,
    Reset,
}

pub async fn command(State(sim): State<AppState>, Json(cmd): Json<Command>) {
    match cmd {
        Command::Precharge => {
            let msg: Option<MessageContent> = {
                let mut s = sim.sim.lock().await;

                if s.get_state().eq(&SimState::Idle) {
                    s.set_state(SimState::Precharge);
                    println!("Se ha pulsado PRECHARGE");
                    s.inform()
                } else {
                    println!("Error: PRECHARGE solo se puede pulsar desde el estado IDLE");
                    Some(MessageContent {
                        r#type: "error".to_string(),
                        content: "Command PRECHARGE only allowed in IDLE state".to_string(),
                    })
                }
            };

            if let Some(m) = msg {
                sim.message
                    .send(WsMessage {
                        topic: "message".to_string(),
                        payload: m,
                    })
                    .ok();
            }
        }
        Command::Start { payload } => {
            let msg = {
                let mut s = sim.sim.lock().await;
                if s.get_state().eq(&SimState::Ready) {
                    s.set_mass(payload.mass);
                    s.set_state(SimState::Running);

                    println!("Se ha pulsado START con payload: {:?}", payload.mass);
                    s.inform()
                } else {
                    println!("Error: START solo se puede pulsar desde el estado READY");
                    Some(
                        MessageContent {
                            r#type: "error".to_string(),
                            content: "Command START only allowed in READY state".to_string(),
                        }
                    )
                }
            };

            if let Some(m) = msg {
                sim.message
                    .send(WsMessage {
                        topic: "message".to_string(),
                        payload: m,
                    })
                    .ok();
            }
        }
        Command::Brake => {
            let msg = {
                let mut s = sim.sim.lock().await;
                if s.get_state().eq(&SimState::Running) || s.get_state().eq(&SimState::Boosting) {
                    s.set_state(SimState::Braking);
                    println!("Se ha pulsado BRAKE");
                    s.inform()
                } else {
                    println!(
                        "Error: BRAKE solo se puede pulsar desde los estados RUNNING o BOOSTING"
                    );
                    Some(MessageContent {
                        r#type: "error".to_string(),
                        content: "Command BRAKE only allowed in RUNNING or BOOSTING state".to_string(),
                    })
                }
            };

            if let Some(m) = msg {
                sim.message
                    .send(WsMessage {
                        topic: "message".to_string(),
                        payload: m,
                    })
                    .ok();
            }
        }
        Command::Reset => {
            let msg = {
                let mut s = sim.sim.lock().await;
                s.reset()
            };

            if let Some(m) = msg {
                sim.message
                    .send(WsMessage {
                        topic: "message".to_string(),
                        payload: m,
                    })
                    .ok();
            }

            println!("Se ha pulsado RESET");
        }
    }
}
