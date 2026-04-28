struct MessagePayload {
    r#type: String,
    content: String
}

pub struct Message {
    topic: String,
    payload: MessagePayload
}