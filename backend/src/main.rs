use axum::{
    Router,
    http::HeaderValue,
    routing::{get, post},
};
use backend::{
    config::AppState,
    http,
    models::message::WsMessage,
    physics::simulator::{SharedSim, SimSnapshot, Simulator},
    websocket,
};
use std::sync::Arc;
use tokio::sync::{Mutex, broadcast};
use tower_http::cors::{Any, CorsLayer};

#[tokio::main]
async fn main() {

    println!("\n\nBackend initialized:\n- HTTP server on port 8001\n- WebSocket server on port 5001\n\nTo stop the server, press Ctrl+C");
    // Set up CORS to allow requests from any origin
    let cors_http = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let cors_ws = CorsLayer::new()
        .allow_origin("http://localhost:5173".parse::<HeaderValue>().unwrap())
        .allow_methods(Any)
        .allow_headers(Any);

    // high capacity to avoid lagging the simulator if the frontend is not consuming fast enough
    let (data, _) = broadcast::channel::<SimSnapshot>(2);
    let (message, _) = broadcast::channel::<WsMessage>(1);

    let sim: SharedSim = Arc::new(Mutex::new(Simulator::new()));
    let sim_for_loop = Arc::clone(&sim);
    tokio::spawn(Simulator::run(sim_for_loop, data.clone(), message.clone()));

    let state = AppState { sim, data, message };

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
