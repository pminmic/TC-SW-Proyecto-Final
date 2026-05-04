use serde::Serialize;

#[derive(Serialize, Clone, Debug)]
pub struct WsMessage {
    pub topic: String,
    pub payload: MessageContent,
}

#[derive(Serialize, Clone, Debug)]
pub struct MessageContent {
    #[serde(rename = "type")]
    pub r#type: String,
    pub content: String,
}
