import type { HeaderDataProps } from "@/types/props"
import { Card, CardHeader, CardTitle } from "../ui/card"


const HeaderData = ({ payload }: HeaderDataProps) => {

    if (!payload) {
        return (
            <span>
                No data received yet.
            </span>
        )
    }

    let stateColor = ""

    switch (payload.state) {
        case "Idle":
            stateColor = "gray-500"
            break
        case "Precharge":
            stateColor = "yellow-500"
            break
        case "Ready":
            stateColor = "green-500"
            break
        case "Running":
            stateColor = "blue-500"
            break
        case "Boosting":
            stateColor = "purple-500"
            break
        case "Braking":
            stateColor = "orange-500"
            break
        case "Stopped":
            stateColor = "orange-700"
            break
        case "Crashed":
            stateColor = "red-500"
            break
        default:
            stateColor = ""
    }

    const stateCircle = <div className={`rounded-full w-4 h-4 bg-${stateColor}`}></div>

    return (
        <div className={`w-full mb-5 flex justify-between align-middle`}>
            <Card className="min-h-1/12 min-w-1/8">
                <CardHeader>
                    <CardTitle className="text-lg text-center">
                        <span className="font-bold">Position:</span> {payload.position_m.toFixed(2)} m
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="min-h-1/12 min-w-1/8  ">
                <CardHeader>
                    <CardTitle className="text-lg text-center">
                        <span className="font-bold">Velocity:</span> {payload.velocity_kmh.toFixed(2)} km/h
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="min-h-1/12 min-w-1/8">
                <CardHeader>
                    <CardTitle className="text-lg text-center">
                        <span className="font-bold">Acc.:</span> {payload.acceleration_ms2.toFixed(2)} m/s²
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className={`min-h-1/12 min-w-1/6 border-${stateColor} border-2 bg-${stateColor}/50`}>
                <CardHeader>
                    <CardTitle className="flex align-middle items-center justify-center gap-2 text-lg">
                        <span className="font-bold">State:</span>
                        <span>{stateCircle}</span>
                        <span>{payload.state.toUpperCase()}</span>
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="min-h-1/12 min-w-1/8">
                <CardHeader>
                    <CardTitle className="text-lg text-center">
                        <span className="font-bold">Mass:</span> {payload.mass_kg.toFixed(2)} kg
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="min-h-1/12 min-w-1/8">
                <CardHeader>
                    <CardTitle className="text-lg text-center">
                        <span className="font-bold">Voltage:</span> {payload.voltage_v.toFixed(2)} V
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="min-h-1/12 min-w-1/8">
                <CardHeader>
                    <CardTitle className="text-lg text-center">
                        <span className="font-bold">Current:</span> {payload.current_a.toFixed(2)} A
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>
    )
}

export default HeaderData