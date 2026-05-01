use axum::{
    extract::{State, WebSocketUpgrade},
    response::IntoResponse,
    extract::ws::{Message, WebSocket},
};
use futures::{sink::SinkExt, stream::StreamExt};
use crate::config::AppState;
use crate::models::data::WsData; 

pub async fn ws_handler(
    ws: WebSocketUpgrade,
    State(state): State<AppState>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_socket(socket, state))
}

async fn handle_socket(socket: WebSocket, state: AppState) {
    // Cada cliente recibe su propio receiver del broadcast
    let mut rx = state.broadcast.subscribe();
    let (mut sender, _receiver) = socket.split();

    while let Ok(snapshot) = rx.recv().await {
        let msg = serde_json::to_string(&WsData {
            topic: "data".to_string(),
            payload: snapshot,
        }).unwrap();

        if sender.send(Message::Text(msg.into())).await.is_err() {
            break; // cliente desconectado, salimos limpiamente
        }
    }
}