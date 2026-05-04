# Physics module

This module contains the core logic of the simulation. Its main responsibility is to model the behaviour of the vehicle over time and update its physical values depending on the current state of the system.

The simulator is implemented in `simulator.rs` through the `Simulator` struct. This struct stores the current simulation data, such as position, velocity, acceleration, voltage, current, mass, state, and timestamp.

## Approach

The simulation follows a state-based approach. The vehicle behaviour changes depending on the current `State`:

- `Idle`: initial state of the simulator.
- `Precharge`: increases the voltage until the system reaches the required precharge value.
- `Ready`: indicates that the precharge process has finished successfully.
- `Running`: moves the vehicle before and after the booster section.
- `Boosting`: applies acceleration while the vehicle is inside the booster section.
- `Braking`: applies a braking force until the vehicle stops.
- `Stopped`: final state when the vehicle stops correctly.
- `Crashed`: state reached when the vehicle reaches the mechanical stopper.

The simulator runs in a loop using a fixed tick rate of 250 ms. On each tick, the current state is checked and the corresponding update function is executed. This makes the simulation predictable and easier to control.

## Shared simulator

The simulator is shared between different asynchronous tasks using:

```rust
Arc<Mutex<Simulator>>
```

This allows the HTTP handlers, the WebSocket broadcaster, and the simulation loop to safely access and modify the same simulator instance.

A type alias is used to make this easier to read:

```rust
pub type SharedSim = Arc<Mutex<Simulator>>;
```

## Simulation loop

The `run` function is responsible for executing the simulation continuously. Every 250 ms, it:

1. Updates the timestamp.
2. Executes the logic corresponding to the current state.
3. Creates a snapshot of the simulator.
4. Sends the snapshot through a broadcast channel.
5. Sends an information message if a relevant event has occurred.

The simulation data is sent using a `broadcast::Sender<SimSnapshot>`, allowing multiple WebSocket clients to receive the same real-time data.

## Snapshots and messages

The `SimSnapshot` struct represents the current state of the simulator at a specific moment. It is serializable, so it can be sent to clients through WebSocket.

The simulator can also generate `WsMessage` messages when important events happen, such as:

* precharge completed;
* booster section entered;
* braking started;
* vehicle stopped;
* crash detected.

This separates continuous simulation data from punctual information messages.

## Physics logic

The movement of the vehicle is updated depending on the current phase of the simulation.

Before the booster section, the vehicle moves at a constant velocity. Inside the booster section, the simulator calculates the required acceleration to reach the target velocity before leaving the section. During braking, a negative acceleration is applied based on the braking force and the vehicle mass.

The simulator also checks if the vehicle reaches the mechanical stopper at `50 m`. If this happens, the state changes to `Crashed`.

## Public methods

The module also provides getter and setter methods to access or update simulator values from other parts of the backend. These methods are mainly used by the HTTP module to read the current state, set the vehicle mass, reset the simulator, or change its state.