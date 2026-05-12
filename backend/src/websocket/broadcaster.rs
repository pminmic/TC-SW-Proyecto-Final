use crate::config::AppState;
use crate::models::data::WsData;
use axum::{
    extract::ws::{Message, WebSocket},
    extract::{State, WebSocketUpgrade},
    response::IntoResponse,
};
use futures::{sink::SinkExt, stream::StreamExt};
use tokio::sync::broadcast::error::RecvError;

pub async fn ws_handler(ws: WebSocketUpgrade, State(state): State<AppState>) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_socket(socket, state))
}

async fn handle_socket(socket: WebSocket, state: AppState) {
    // Each client gets its own receiver from the broadcast channel
    let mut data_rx = state.data.subscribe();
    let mut message_rx = state.message.subscribe();
    let (mut sender, _receiver) = socket.split();

    loop {
        tokio::select! {
            result = data_rx.recv() => {
                match result {
                    Ok(snapshot) => {
                        let json = serde_json::to_string(&WsData {
                            topic: "data".to_string(),
                            payload: snapshot,
                        }).unwrap();
                        if sender.send(Message::Text(json.into())).await.is_err() { break; }
                    }
                    Err(RecvError::Lagged(n)) => {
                        eprintln!("Client lagged behind by {} messages", n);
                    }
                    Err(RecvError::Closed) => {
                        eprintln!("Channel closed");
                        break;
                    }
                }
            }

            result = message_rx.recv() => {
                match result {
                    Ok(msg) => {
                        let json = serde_json::to_string(&msg).unwrap();
                        if sender.send(Message::Text(json.into())).await.is_err() { break; }
                    }
                    Err(RecvError::Lagged(n)) => {
                        eprintln!("Client lagged behind by {} messages", n);
                    }
                    Err(RecvError::Closed) => {
                        eprintln!("Channel closed");
                        break;
                    }
                }
            }
        }
    }
}
