use axum::{Json};
use serde::Deserialize;

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

pub async fn command(Json(cmd): Json<Command>) {
    match cmd {
        Command::Precharge => {
            println!("Se ha pulsado PRECHARGE");
        },
        Command::Start { payload } => {
            println!("Se ha pulsado START con payload: {:?}", payload.mass);
        }
        Command::Brake => {
            println!("Se ha pulsado BRAKE");
        }
        Command::Reset => {
            println!("Se ha pulsado RESET");
        }
    }
}