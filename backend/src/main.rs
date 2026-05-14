use axum::{
    Router,
    http::HeaderValue,
    routing::{get, post}
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
use tower_http::{cors::{Any, CorsLayer}, services::ServeDir};

#[tokio::main]
async fn main() {
    let port = std::env::var("PORT").unwrap_or("3000".to_string());

    println!("\n\nBackend initialized on port {port}");

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let (data, _) = broadcast::channel::<SimSnapshot>(2);
    let (message, _) = broadcast::channel::<WsMessage>(1);
    let sim: SharedSim = Arc::new(Mutex::new(Simulator::new()));
    let sim_for_loop = Arc::clone(&sim);
    tokio::spawn(Simulator::run(sim_for_loop, data.clone(), message.clone()));

    let state = AppState { sim, data, message };

    let app = Router::new()
        .route("/api/calculate", get(http::calculate::calculate))
        .route("/api/command", post(http::command::command))
        .route("/backend/stream", get(websocket::broadcaster::ws_handler))
        .fallback_service(ServeDir::new("dist"))
        .with_state(state)
        .layer(cors);

    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{port}")).await.unwrap();
    println!("Servidor escuchando en 0.0.0.0:{port}");
    axum::serve(listener, app).await.unwrap();
}