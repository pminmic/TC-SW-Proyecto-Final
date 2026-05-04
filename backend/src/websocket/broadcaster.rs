use crate::config::AppState;
use crate::models::data::WsData;
use axum::{
    extract::ws::{Message, WebSocket},
    extract::{State, WebSocketUpgrade},
    response::IntoResponse,
};
use futures::{sink::SinkExt, stream::StreamExt};

pub async fn ws_handler(ws: WebSocketUpgrade, State(state): State<AppState>) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_socket(socket, state))
}

async fn handle_socket(socket: WebSocket, state: AppState) {
    // Cada cliente recibe su propio receiver del broadcast
    let mut data_rx = state.data.subscribe();
    let mut message_rx = state.message.subscribe();
    let (mut sender, _receiver) = socket.split();

    loop {
        tokio::select! {
            Ok(snapshot) = data_rx.recv() => {
                let json = serde_json::to_string(&WsData {
                    topic: "data".to_string(),
                    payload: snapshot,
                }).unwrap();
                if sender.send(Message::Text(json.into())).await.is_err() { break; }
            }
            Ok(msg) = message_rx.recv() => {
                let json = serde_json::to_string(&msg).unwrap();
                if sender.send(Message::Text(json.into())).await.is_err() { break; }
            }
        }
    }
}
