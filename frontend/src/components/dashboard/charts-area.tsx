import { memo, useMemo } from "react"
import {
    Chart as ChartJS,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Tooltip,
    Legend,
    Decimation,
    Filler,
    type ChartData,
    type ChartOptions,
} from "chart.js"
import { Line } from "react-chartjs-2"
import type { ChartKey, ChartPoint } from "@/types/types"
import type { ChartsAreaProps, SingleChartPropsChartJS } from "@/types/props"

ChartJS.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Tooltip,
    Legend,
    Decimation,
    Filler
)

const KEYS = ["voltage", "acceleration", "velocity", "force", "intensity"] as const

const MAX_POINTS = 20

const CHART_CONFIGS: Record<
    ChartKey,
    {
        label: string
        color: string
        backgroundColor: string
        yAxisLabel: string
    }
> = {
    voltage: {
        label: "Voltage (V)",
        color: "#FACC15",
        backgroundColor: "rgba(250, 204, 21, 0.14)",
        yAxisLabel: "Voltage (V)",
    },
    acceleration: {
        label: "Acceleration (m/s²)",
        color: "#A78BFA",
        backgroundColor: "rgba(167, 139, 250, 0.14)",
        yAxisLabel: "Acceleration (m/s²)",
    },
    velocity: {
        label: "Velocity (km/h)",
        color: "#FB923C",
        backgroundColor: "rgba(251, 146, 60, 0.14)",
        yAxisLabel: "Velocity (km/h)",
    },
    force: {
        label: "Force (N)",
        color: "#38BDF8",
        backgroundColor: "rgba(56, 189, 248, 0.14)",
        yAxisLabel: "Force (N)",
    },
    intensity: {
        label: "Current (A)",
        color: "#4ADE80",
        backgroundColor: "rgba(74, 222, 128, 0.14)",
        yAxisLabel: "Current (A)",
    },
}

const DOMAIN_CONFIGS: Record<ChartKey, [number, number]> = {
    voltage: [0, 400],
    acceleration: [-30, 30],
    velocity: [-25, 25],
    force: [-1000, 1500],
    intensity: [-200, 200],
}

const toTimestampMs = (timestamp: string | number | Date) => {
    if (timestamp instanceof Date) return timestamp.getTime()
    if (typeof timestamp === "number") return timestamp
    return new Date(timestamp).getTime()
}

const tickFormatter = (value: number | string) => {
    const date = new Date(Number(value))

    if (Number.isNaN(date.getTime())) return ""

    return date.toLocaleTimeString("es-ES", {
        minute: "2-digit",
        second: "2-digit",
    })
}

const SingleChart = memo(({ dataKey, data, height }: SingleChartPropsChartJS) => {
    const config = CHART_CONFIGS[dataKey]

    const chartData = useMemo<ChartData<"line", ChartPoint[], number>>(
        () => ({
            datasets: [
                {
                    label: config.label,
                    data,

                    borderColor: config.color,
                    backgroundColor: config.backgroundColor,

                    borderWidth: 3,
                    borderCapStyle: "round",
                    borderJoinStyle: "round",

                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointHoverBorderWidth: 2,
                    pointHoverBackgroundColor: config.color,
                    pointHoverBorderColor: "#F8FAFC",

                    // Con 20 puntos podemos permitir una curva suave.
                    // Si prefieres máxima precisión visual, cambia a 0.
                    tension: 0.25,

                    fill: true,
                    spanGaps: true,
                    parsing: false,
                },
            ],
        }),
        [config, data]
    )

    const options = useMemo<ChartOptions<"line">>(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            normalized: true,

            layout: {
                padding: {
                    top: 10,
                    right: 18,
                    bottom: 8,
                    left: 6,
                },
            },

            interaction: {
                mode: "nearest",
                axis: "x",
                intersect: false,
            },

            plugins: {
                legend: {
                    display: false,
                },

                tooltip: {
                    enabled: true,
                    backgroundColor: "rgba(15, 23, 42, 0.96)",
                    titleColor: "#F8FAFC",
                    bodyColor: "#E2E8F0",
                    borderColor: config.color,
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,

                    callbacks: {
                        title: items => {
                            const index = Math.round(items[0]?.parsed.x ?? 0)
                            const point = data[index]

                            return point ? tickFormatter(point.timestamp) : ""
                        },

                        label: context => {
                            return `${config.label}: ${context.parsed.y.toFixed(2)}`
                        },
                    },
                },

                decimation: {
                    enabled: true,
                    algorithm: "min-max",
                    threshold: 1000,
                },
            },

            elements: {
                point: {
                    radius: 0,
                    hitRadius: 12,
                    hoverRadius: 5,
                },

                line: {
                    tension: 0.25,
                },
            },

            scales: {
                x: {
                    type: "linear",
                    min: 0,
                    max: MAX_POINTS - 1,

                    bounds: "ticks",
                    offset: false,

                    border: {
                        display: true,
                        color: "rgba(226, 232, 240, 0.55)",
                        width: 1.5,
                    },

                    grid: {
                        display: true,
                        color: "rgba(148, 163, 184, 0.22)",
                        lineWidth: 1,
                        drawTicks: true,
                        tickLength: 6,
                        tickColor: "rgba(226, 232, 240, 0.55)",
                    },

                    ticks: {
                        color: "rgba(226, 232, 240, 0.82)",
                        font: {
                            size: 11,
                            weight: 500,
                        },
                        stepSize: 1,
                        autoSkip: false,
                        minRotation: 0,
                        maxRotation: 0,
                        sampleSize: MAX_POINTS,

                        callback: value => {
                            const index = Number(value)

                            if (!Number.isInteger(index)) return ""

                            const shouldShowLabel =
                                index === 0 ||
                                index === 5 ||
                                index === 10 ||
                                index === 15 ||
                                index === data.length - 1

                            if (!shouldShowLabel) return ""

                            const point = data[index]

                            return point ? tickFormatter(point.timestamp) : ""
                        },
                    },
                },

                y: {
                    type: "linear",
                    min: DOMAIN_CONFIGS[dataKey][0],
                    max: DOMAIN_CONFIGS[dataKey][1],

                    border: {
                        display: true,
                        color: "rgba(226, 232, 240, 0.55)",
                        width: 1.5,
                    },

                    grid: {
                        display: true,
                        color: context => {
                            if (context.tick.value === 0) {
                                return "rgba(248, 250, 252, 0.45)"
                            }

                            return "rgba(148, 163, 184, 0.18)"
                        },
                        lineWidth: context => {
                            if (context.tick.value === 0) {
                                return 1.5
                            }

                            return 1
                        },
                        drawTicks: true,
                        tickLength: 6,
                        tickColor: "rgba(226, 232, 240, 0.55)",
                    },

                    title: {
                        display: true,
                        text: config.yAxisLabel,
                        color: "rgba(226, 232, 240, 0.9)",
                        font: {
                            size: 12,
                            weight: 600,
                        },
                    },

                    ticks: {
                        color: "rgba(226, 232, 240, 0.82)",
                        font: {
                            size: 11,
                            weight: 500,
                        },
                        sampleSize: 8,
                    },
                },
            },
        }),
        [config, data, dataKey]
    )

    return (
        <div
            style={{ height, position: "relative" }}
            className="w-full min-h-0 p-2"
        >
            <div className="relative h-full w-full rounded-xl border bg-sidebar pt-2 shadow-inner">
                <Line data={chartData} options={options} updateMode="none" />
            </div>
        </div>
    )
})

SingleChart.displayName = "SingleChart"

const ChartsArea = ({ variableSelected, payload }: ChartsAreaProps) => {
    const visiblePayload = useMemo(() => {
        return payload.slice(-MAX_POINTS)
    }, [payload])

    const chartData = useMemo<Record<ChartKey, ChartPoint[]>>(() => {
        const data: Record<ChartKey, ChartPoint[]> = {
            voltage: [],
            acceleration: [],
            velocity: [],
            force: [],
            intensity: [],
        }

        const anyActive =
            variableSelected.voltage ||
            variableSelected.acceleration ||
            variableSelected.velocity ||
            variableSelected.force ||
            variableSelected.intensity

        if (!anyActive) return data

        visiblePayload.forEach((n, index) => {
            const timestamp = toTimestampMs(n.timestamp)
            const x = index

            if (variableSelected.voltage) {
                data.voltage.push({
                    x,
                    y: n.voltage_v,
                    timestamp,
                })
            }

            if (variableSelected.acceleration) {
                data.acceleration.push({
                    x,
                    y: n.acceleration_ms2,
                    timestamp,
                })
            }

            if (variableSelected.velocity) {
                data.velocity.push({
                    x,
                    y: n.velocity_kmh,
                    timestamp,
                })
            }

            if (variableSelected.force) {
                data.force.push({
                    x,
                    y:
                        n.mass_kg * n.acceleration_ms2 -
                        n.mass_kg * 9.81 * (n.state === "Braking" ? 0.5 : 0.0),
                    timestamp,
                })
            }

            if (variableSelected.intensity) {
                data.intensity.push({
                    x,
                    y: n.current_a,
                    timestamp,
                })
            }
        })

        return data
    }, [visiblePayload, variableSelected])

    const activeKeys = useMemo(
        () => KEYS.filter(key => variableSelected[key]),
        [variableSelected]
    )

    const chartHeight = `${100 / (activeKeys.length || 1)}%`

    return (
        <div className="h-full w-full p-4 flex flex-col">
            {activeKeys.map(key => (
                <SingleChart
                    key={key}
                    dataKey={key}
                    data={chartData[key]}
                    height={chartHeight}
                />
            ))}
        </div>
    )
}

export default memo(ChartsArea)