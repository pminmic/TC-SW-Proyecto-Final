# Backend

This backend was developed in Rust (using Cargo as package manager) to simulate the vehicle behaviour according to the [specifications](https://tc-software.hyperloopupv.com/pages/final.html) provided by our teacher, [@JavierRibaldelRio](https://github.com/javierribaldelrio).

The backend is composed of four main modules that work together to handle the simulation, process 
commands, expose HTTP endpoints, and broadcast real-time updates through WebSockets.

The main *crates* (Rust packages) used in this project are:

- [`axum`](https://docs.rs/axum/latest/axum/): used to define the HTTP and WebSocket endpoints.
- [`serde`](https://docs.rs/serde/latest/serde/): used to serialize and deserialize the data sent and received through the API.
- [`tokio`](https://docs.rs/tokio/latest/tokio/): used as the asynchronous runtime for concurrency.

## How to run

```bash
cargo run
```

## Project structure

```text
├── Cargo.toml
├── README.md
└── src
    ├── config.rs
    ├── http
    │   ├── calculate.rs
    │   ├── command.rs
    │   ├── http.md
    │   └── mod.rs
    ├── lib.rs
    ├── main.rs
    ├── models
    │   ├── data.rs
    │   ├── message.rs
    │   ├── models.md
    │   └── mod.rs
    ├── physics
    │   ├── mod.rs
    │   ├── physics.md
    │   └── simulator.rs
    └── websocket
        ├── broadcaster.rs
        ├── mod.rs
        └── websocket.md

```

### Modules


| Module | Responsibility |
|--------|----------------|
| `physics` | Contains the simulator and vehicle behaviour logic. |
| `http` | Defines the HTTP routes used to interact with the backend. |
| `websocket` | Broadcasts real-time simulation data to connected clients. |
| `models` | Defines the shared data structures used by the backend. |

### Comunication between modules

The core logic of the backend is implemented in the [physics module](./src/physics/physics.md), where the simulator and its behaviour are defined.

The [HTTP module](./src/http/http.md) defines the available HTTP endpoints. These endpoints allow external clients to send commands, request calculations, and interact with the simulator.

The [WebSocket module](./src/websocket/websocket.md) is responsible for broadcasting real-time simulation data to connected clients.

The [models module](./src/models/models.md) contains the data structures used across the backend, including messages, commands, and simulation data.

## Explanation

### `main.rs`

This is the entry point of the backend.

The main goal of this file is to keep the application startup logic in one place while delegating the actual behaviour to the different modules. It initializes the simulator, creates the broadcast channels, builds the shared application state, defines the HTTP and WebSocket routes, and starts both servers.

In this file, two different CORS policies are configured. The HTTP server allows requests from any origin, while the WebSocket server only allows requests from the frontend origin, `http://localhost:5173`.

The simulator is created as a shared resource using `Arc<Mutex<Simulator>>`, allowing it to be safely accessed from different asynchronous tasks. Then, the simulator loop is started in a background Tokio task using `tokio::spawn`.

Two broadcast channels are also created:

- one for sending simulation snapshots
- one for sending WebSocket messages

Finally, two Axum routers are created: one for the HTTP API and another one for the WebSocket stream. Each router is bound to a different port and both servers are run concurrently using `tokio::join!`.


### `config.rs`

This file contains the application configuration and shared data structures used across the project, such as the `AppState`.

### `lib.rs`

This file declares the project modules and makes them available to the rest of the crate. This allows `main.rs` to import modules such as `config`, `http`, `models`, `physics`, and `websocket`.
