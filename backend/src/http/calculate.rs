use crate::config::{BRAKE_FORCE, BEFORE_BOOSTER_VELOCITY};
use axum::{Json, extract::Query, http::StatusCode};
use serde::{Deserialize, Serialize};

// Convert initial velocity from km/h to m/s
const I_VEL_MS: f32 = BEFORE_BOOSTER_VELOCITY / 3.6;

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
    
    // Calculations according to the project specifications (and physics obvously)
    let brake_distance: f32 = (I_VEL_MS.powf(2.0) * parameters.m) / (2.0 * BRAKE_FORCE);
    let brake_position: f32 = (50.0 - parameters.d) - brake_distance;

    // Validate that the braking position is within the track limits
    if brake_position < 0.0 {
        return Err((
            StatusCode::BAD_REQUEST,
            "Error: Braking position not in the track limits".to_string(),
        ));
    }

    // Return the calculated braking position as JSON
    Ok(Json(CalculateResponse {
        braking_position_m: brake_position,
    }))
}
