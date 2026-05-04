# HTTP module

This module defines the HTTP interface of the backend. Its main purpose is to allow external clients, such as the frontend, to interact with the simulator through HTTP requests.

The module is divided into two files:

- `calculate.rs`: handles calculation requests.
- `command.rs`: handles simulator commands.

The `mod.rs` file exposes both submodules so they can be used from the main application router.

## Approach

The approach used in this module is to keep the HTTP layer simple and focused on communication. The actual simulation logic is not implemented here; instead, this module receives requests, validates them when necessary, and delegates the state changes to the simulator.

This separation makes the backend easier to maintain, because the HTTP module only acts as an entry point to the simulator.

## `calculate.rs`

This file defines the logic for calculating the braking position of the vehicle.

The endpoint receives two query parameters:

- `m`: mass of the vehicle.
- `d`: desired distance from the end of the track.

Using these values, the backend calculates the distance needed to brake and returns the position where braking should start.

If the calculated braking position is outside the valid track limits, the endpoint returns a `400 Bad Request` error.

The response is returned as JSON with the following structure:

```json
{
  "braking_position_m": 12.5
}
```

## `command.rs`

This file defines the commands that can be sent to the simulator.

The commands are deserialized from JSON using a tagged enum. This allows the backend to receive different command types through the same endpoint.

The available commands are:

* `PRECHARGE`: starts the precharge process.
* `START`: starts the simulation and sets the vehicle mass.
* `BRAKE`: starts braking the vehicle.
* `RESET`: resets the simulator to its initial state.

Each command is only accepted in specific simulator states. For example, `PRECHARGE` can only be executed from `Idle`, `START` only from `Ready`, and `BRAKE` only from `Running` or `Boosting`.

If a command is not allowed in the current state, the backend sends an error message instead of changing the simulator state.

## Shared state

The command handler receives the shared application state through Axum's `State` extractor. This gives the HTTP module access to the shared simulator and to the WebSocket message channel.

When a command is received, the simulator is locked, updated if the command is valid, and then an informational or error message is sent through the WebSocket channel.

This allows the frontend to receive immediate feedback after sending a command.

## Example commands

### Precharge

```json
{
  "command": "PRECHARGE"
}
```

### Start

```json
{
  "command": "START",
  "payload": {
    "mass": 250
  }
}
```

### Brake

```json
{
  "command": "BRAKE"
}
```

### Reset

```json
{
  "command": "RESET"
}
```
