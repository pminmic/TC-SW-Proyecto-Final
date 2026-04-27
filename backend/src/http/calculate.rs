use crate::config::{BRAKE_FORCE, INITIAL_VELOCITY};
use axum::{Json, extract::Query, http::StatusCode};
use serde::{Deserialize, Serialize};

const I_VEL_MS: f32 = INITIAL_VELOCITY / 3.6;

#[derive(Deserialize)]
pub struct CalculateParameters {
    m: f32, // Mass of the vehicle
    d: f32, // Desired distance at the end of the track
}

#[derive(Serialize)]
pub struct CalculateResponse {
    braking_position_m: f32,
}

pub async fn calculate(
    Query(parameters): Query<CalculateParameters>,
) -> Result<Json<CalculateResponse>, (StatusCode, String)> {
    let brake_distance: f32 = (I_VEL_MS.powf(2.0) * parameters.m) / (2.0 * BRAKE_FORCE);

    let brake_position: f32 = (50.0 - parameters.d) - brake_distance;

    if brake_position < 0.0 {
        return Err((
            StatusCode::BAD_REQUEST,
            "Error: Braking position not in the track section".to_string(),
        ));
    }

    Ok(Json(CalculateResponse {
        braking_position_m: brake_position,
    }))
}
