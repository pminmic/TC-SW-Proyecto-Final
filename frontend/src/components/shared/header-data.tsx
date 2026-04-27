import type { HeaderDataProps } from "@/types/props"


const HeaderData = ({ payload }: HeaderDataProps) => {

    if (!payload) {
        return (
            <span>
                No data received yet.
            </span>
        )
    }

    let stateColor = null

    if (payload.state === "IDLE") {
        stateColor = <div className="rounded-full bg-gray-500 w-2 h-2"></div>
    }
    else if (payload.state === "PRECHARGE") {
        stateColor = <div className="rounded-full bg-yellow-500 w-2 h-2"></div>
    }
    else if (payload.state === "READY") {
        stateColor = <div className="rounded-full bg-green-500 w-2 h-2"></div>
    }
    else if (payload.state === "RUNNING") {
        stateColor = <div className="rounded-full bg-blue-500 w-2 h-2"></div>
    }
    else if (payload.state === "BOOSTING") {
        stateColor = <div className="rounded-full bg-purple-500 w-2 h-2"></div>
    }
    else if (payload.state === "BRAKING") {
        stateColor = <div className="rounded-full bg-orange-500 w-2 h-2"></div>
    }
    else if (payload.state === "STOPPED") {
        stateColor = <div className="rounded-full bg-red-500 w-2 h-2"></div>
    }

    return (
        <span className="flex justify-between px-10">
            <span className="flex items-center gap-1">
                <span className="font-bold">State:</span>
                <span>{stateColor}</span>
                <span>{payload.state}</span>
            </span>
            <span>
                <span className="font-bold">Position:</span> {payload.position_m.toFixed(2)} m
            </span>
            <span>
                <span className="font-bold">Velocity:</span> {payload.velocity_kmh.toFixed(2)} km/h
            </span>
            <span>
                <span className="font-bold">Acceleration:</span> {payload.acceleration_ms2.toFixed(2)} m/s²
            </span>
            <span>
                <span className="font-bold">Mass:</span> {payload.mass_kg.toFixed(2)} kg
            </span>
            <span>
                <span className="font-bold">Voltage:</span> {payload.voltage_v.toFixed(2)} V
            </span>
            <span>
                <span className="font-bold">Current:</span> {payload.current_a.toFixed(2)} A
            </span>
        </span>
    )
}

export default HeaderData