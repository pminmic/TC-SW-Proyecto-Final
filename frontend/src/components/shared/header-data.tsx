import type { HeaderDataProps } from "@/types/props"
import { Card, CardHeader, CardTitle } from "../ui/card"


const HeaderData = ({ payload }: HeaderDataProps) => {

    if (!payload) {
        return (
            <Card className="mb-5 text-lg pl-3">
                No data received yet.
            </Card>
        )
    }

    const stateStyles: Record<string, { bg: string; border: string; circle: string }> = {
        Idle: { bg: "bg-gray-500/50", border: "border-gray-500", circle: "bg-gray-500" },
        Precharge: { bg: "bg-yellow-500/50", border: "border-yellow-500", circle: "bg-yellow-500" },
        Ready: { bg: "bg-green-500/50", border: "border-green-500", circle: "bg-green-500" },
        Running: { bg: "bg-blue-500/50", border: "border-blue-500", circle: "bg-blue-500" },
        Boosting: { bg: "bg-purple-500/50", border: "border-purple-500", circle: "bg-purple-500" },
        Braking: { bg: "bg-orange-500/50", border: "border-orange-500", circle: "bg-orange-500" },
        Stopped: { bg: "bg-orange-800/50", border: "border-orange-800", circle: "bg-orange-800" },
        Crashed: { bg: "bg-red-600/50", border: "border-red-600", circle: "bg-red-600" },
    }

    const styles = stateStyles[payload.state] ?? { bg: "", border: "", circle: "" }

    const stateCircle = <div className={`rounded-full w-4 h-4 ${styles.circle}`}></div>

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
                        <span className="font-bold">Vel.:</span> {payload.velocity_kmh.toFixed(2)} km/h
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
            <Card className={`min-h-1/12 min-w-1/6 border-2 ${styles.border} ${styles.bg}`}>
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