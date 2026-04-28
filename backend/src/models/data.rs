use backend::config::State;
use backend::physics::simulator::Simulator;
use iso8601_timestamp::Timestamp;


pub struct Data {
    topic: String,
    payload: Simulator
}