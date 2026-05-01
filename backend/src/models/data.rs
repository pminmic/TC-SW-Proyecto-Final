use serde::Serialize;
use crate::physics::simulator::SimSnapshot;

#[derive(Serialize)]
pub struct WsData {
    pub topic: String,
    pub payload: SimSnapshot,
}