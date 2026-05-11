import { useMemo, memo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart"
import type { ChartsAreaProps } from "@/types/props"



// Configuration for each variable's chart
const CHART_CONFIGS: Record<string, ChartConfig> = {
    voltage: { voltage: { label: "Voltage (V)", color: "#D4B84A" } }, // muted yellow
    acceleration: { acceleration: { label: "Acceleration (m/s²)", color: "#7F6AB8" } }, // muted violet
    velocity: { velocity: { label: "Velocity (km/h)", color: "#D27B45" } }, // muted orange
    force: { force: { label: "Force (N)", color: "#4F82A0" } }, // steel blue
    intensity: { intensity: { label: "Intensity (A)", color: "#74A77B" } }, // soft green
}

const DOMAIN_CONFIGS: Record<string, [number, number]> = {
    voltage: [0, 400],
    acceleration: [-30, 30],
    velocity: [-25, 25],
    force: [-1000, 1500],
    intensity: [-200, 200],
}

const tickFormatter = (val: any) => new Date(val).toLocaleTimeString()

const ChartsArea = ({ variableSelected, payload }: ChartsAreaProps) => {

    const chartData = useMemo(() => {
        // Pre-create containers for all keys so callers can safely access them.
        const data: Record<string, any[]> = {
            voltage: [],
            acceleration: [],
            velocity: [],
            force: [],
            intensity: [],
        }

        // If no variable is active, avoid iterating payload at all.
        const anyActive = variableSelected.voltage || variableSelected.acceleration || variableSelected.velocity || variableSelected.force || variableSelected.intensity
        if (!anyActive) return data

        // Iterate payload once and push into active series only.
        for (const n of payload) {
            if (variableSelected.voltage) data.voltage.push({ time: n.timestamp, voltage: n.voltage_v })
            if (variableSelected.acceleration) data.acceleration.push({ time: n.timestamp, acceleration: n.acceleration_ms2 })
            if (variableSelected.velocity) data.velocity.push({ time: n.timestamp, velocity: n.velocity_kmh })
            if (variableSelected.force) data.force.push({ time: n.timestamp, force: n.mass_kg * n.acceleration_ms2 - n.mass_kg * 9.81 * (n.state === "Braking" ? 0.5 : 0.0) })
            if (variableSelected.intensity) data.intensity.push({ time: n.timestamp, intensity: n.current_a })
        }

        return data
    }, [payload, variableSelected])

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

export default memo(ChartsArea)