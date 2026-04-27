use axum::{Router, routing::get};
use tower_http::cors::{CorsLayer, Any};
use backend::http;

#[tokio::main]
async fn main() {
    let cors = CorsLayer::new()
        .allow_origin(Any) // En producción, pon tu dominio específico
        .allow_methods(Any)
        .allow_headers(Any);

    // Build the app
    let app = Router::<()>::new()
        .route("/api/calculate", get(http::calculate::calculate))
        .layer(cors);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8001").await.unwrap();

    axum::serve(listener, app).await.unwrap();
}
