use axum::{Router, routing::{get, post}};
use tower_http::cors::{CorsLayer, Any};
use backend::http;
use std::sync::Arc;
use tokio::sync::Mutex;
use backend::physics::simulator::{Simulator, SharedSim};

#[tokio::main]
async fn main() {

    // Set up CORS to allow requests from any origin
    let cors = CorsLayer::new()
        .allow_origin(Any) 
        .allow_methods(Any)
        .allow_headers(Any);

    let sim: SharedSim = Arc::new(Mutex::new(Simulator::new()));
    let sim_for_loop = Arc::clone(&sim);
    tokio::spawn(Simulator::run(sim_for_loop));

    // Build the app endpoint routes
    let app = Router::new()
        .route("/api/calculate", get(http::calculate::calculate))
        .route("/api/command", post(http::command::command))
        .with_state(Arc::clone(&sim))
        .layer(cors);

    // Bind the server to the specified address and port
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8001").await.unwrap();

    // Start the server and serve incoming requests
    axum::serve(listener, app).await.unwrap();
}
