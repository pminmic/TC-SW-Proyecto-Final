import type { HeaderDataProps } from "@/types/props"
import { IconSkull } from "@tabler/icons-react"


const HeaderData = ({ payload }: HeaderDataProps) => {

    if (!payload) {
        return (
            <span>
                No data received yet.
            </span>
        )
    }

    let stateColor = null

    switch (payload.state) {
        case "Idle":
            stateColor = <div className="rounded-full bg-gray-500 w-2 h-2"></div>
            break
        case "Precharge":
            stateColor = <div className="rounded-full bg-yellow-500 w-2 h-2"></div>
            break
        case "Ready":
            stateColor = <div className="rounded-full bg-green-500 w-2 h-2"></div>
            break
        case "Running":
            stateColor = <div className="rounded-full bg-blue-500 w-2 h-2"></div>
            break
        case "Boosting":
            stateColor = <div className="rounded-full bg-purple-500 w-2 h-2"></div>
            break
        case "Braking":
            stateColor = <div className="rounded-full bg-orange-500 w-2 h-2"></div>
            break
        case "Stopped":
            stateColor = <div className="rounded-full bg-red-500 w-2 h-2"></div>
            break
        case "Crashed":
            stateColor = <IconSkull className="text-slate-600" />
            break
        default:
            stateColor = null
    }

    return (
        <span className="flex justify-between px-10">
            <span className="flex items-center gap-1">
                <span className="font-bold">State:</span>
                <span>{stateColor}</span>
                <span>{payload.state.toUpperCase()}</span>
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