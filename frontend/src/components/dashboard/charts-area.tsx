import { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart"
import type { ChartsAreaProps } from "@/types/props"



// Configuration for each variable's chart
const CHART_CONFIGS: Record<string, ChartConfig> = {
    voltage: { voltage: { label: "Voltage (V)", color: "#ffe600" } },
    acceleration: { acceleration: { label: "Acceleration (m/s²)", color: "#00ff00" } },
    velocity: { velocity: { label: "Velocity (km/h)", color: "#0000ff" } },
    force: { force: { label: "Force (N)", color: "#ff0000" } },
    intensity: { intensity: { label: "Intensity (A)", color: "#ff00ff" } },
}

const DOMAIN_CONFIGS: Record<string, [number, number]> = {
    voltage: [0, 400],
    acceleration: [-10, 30],
    velocity: [0, 40],
    force: [0, 400],
    intensity: [0, 200],
}

const tickFormatter = (val: any) => new Date(val).toLocaleTimeString()

const ChartsArea = ({ variableSelected, payload }: ChartsAreaProps) => {

    const chartData = useMemo(() => ({
        voltage: payload.map((n: any) => ({ time: n.timestamp, voltage: n.voltage_v })),
        acceleration: payload.map((n: any) => ({ time: n.timestamp, acceleration: n.acceleration_ms2 })),
        velocity: payload.map((n: any) => ({ time: n.timestamp, velocity: n.velocity_kmh })),
        force: payload.map((n: any) => ({ time: n.timestamp, force: n.mass_kg * 9.81 })),
        intensity: payload.map((n: any) => ({ time: n.timestamp, intensity: n.current_a })),
    }), [payload])

    const activeKeys = useMemo(() =>
        (["voltage", "acceleration", "velocity", "force", "intensity"] as const)
            .filter(key => variableSelected[key]),
        [variableSelected]
    )

    const chartHeight = `${100 / (activeKeys.length || 1)}%`

    return (
        <div className="h-full w-full p-5 flex flex-col">
            {activeKeys.map(key => (
                <ChartContainer
                    key={key}
                    config={CHART_CONFIGS[key]}
                    className="w-full"
                    style={{ height: chartHeight }}
                >
                    <LineChart data={chartData[key]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" tickFormatter={tickFormatter} />
                        <YAxis label={{
                            value: CHART_CONFIGS[key][key].label,
                            angle: -90,
                            position: 'insideLeft'
                        }}
                        domain={DOMAIN_CONFIGS[key]}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                            type="monotone"
                            dataKey={key}
                            stroke={`var(--color-${key})`}
                            dot={false}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ChartContainer>
            ))}
        </div>
    )
}

export default ChartsArea