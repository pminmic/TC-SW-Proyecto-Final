export type PayloadType = {
    timestamp: string,
    state: string,
    position_m: number,
    velocity_kmh: number,
    acceleration_ms2: number,
    mass_kg: number,
    voltage_v: number,
    current_a: number,
}

export type VariableSelected = {
    voltage: boolean,
    acceleration: boolean,
    velocity: boolean,
    force: boolean,
    intensity: boolean
}

export type CalculatedDistance = number | string | null

export type ProgressInfo = {
    position_m: number,
    state: string,
}

export type MessageType = [string, string] // [type, content]