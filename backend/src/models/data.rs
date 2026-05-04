use crate::physics::simulator::SimSnapshot;
use serde::Serialize;

#[derive(Serialize)]
pub struct WsData {
    pub topic: String,
    pub payload: SimSnapshot,
}
