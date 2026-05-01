use axum::{
    Router,
    routing::{get, post},
    http::HeaderValue,
};
use backend::config::AppState;
use backend::http;
use backend::physics::simulator::{SharedSim, SimSnapshot, Simulator};
use backend::websocket;
use std::sync::Arc;
use tokio::sync::{Mutex, broadcast};
use tower_http::cors::{Any, CorsLayer};

#[tokio::main]
async fn main() {
    // Set up CORS to allow requests from any origin
    let cors_http = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let cors_ws = CorsLayer::new()
    .allow_origin("http://localhost:5173".parse::<HeaderValue>().unwrap())
    .allow_methods(Any)
    .allow_headers(Any);

    let (broadcast, _) = broadcast::channel::<SimSnapshot>(16);

    let sim: SharedSim = Arc::new(Mutex::new(Simulator::new()));
    let sim_for_loop = Arc::clone(&sim);
    tokio::spawn(Simulator::run(sim_for_loop, broadcast.clone()));

    let state = AppState { sim, broadcast };

    // Build the app endpoint routes
    let app_http = Router::new()
        .route("/api/calculate", get(http::calculate::calculate))
        .route("/api/command", post(http::command::command))
        .with_state(state.clone())
        .layer(cors_http.clone());
    
    let app_ws = Router::new()
        .route("/backend/stream", get(websocket::broadcaster::ws_handler))
        .with_state(state)
        .layer(cors_ws.clone());

    // Bind the server to the specified address and port
    let listener_http = tokio::net::TcpListener::bind("0.0.0.0:8001").await.unwrap();
    let listener_ws = tokio::net::TcpListener::bind("0.0.0.0:5001").await.unwrap();

    // Start the server and serve incoming requests
    let (res_http, res_ws) = tokio::join!(
        axum::serve(listener_http, app_http),
        axum::serve(listener_ws, app_ws),
    );

    if let Err(e) = res_http {
        eprintln!("Error en servidor HTTP: {}", e);
    }
    if let Err(e) = res_ws {
        eprintln!("Error en servidor WS: {}", e);
    }
}
