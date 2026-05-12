import type { ProgressSegmentsProps } from "@/types/props"
import type { ProgressInfo } from "@/types/types"
import { useState, useEffect, memo } from "react"

const ProgressSegments = ({ progressInfo }: ProgressSegmentsProps) => {

    const [progress, setProgress] = useState<(ProgressInfo | null)[]>(new Array(51).fill(null))
    const { position_m, state } = progressInfo

    useEffect(() => {
        // No movement in IDLE or PRECHAGE, also to attend the reset button
        if (position_m == 0 && (state === "Idle" || state === "Precharge" || state === "Ready")) {
            setProgress(new Array(51).fill(null))
        }
        // Supose the State has changed, don't care about position
        else {
            setProgress(prev => {
                const newP = [...prev];
                newP[Math.trunc(position_m)] = progressInfo;
                return newP;
            })
        }
    }, [progressInfo, position_m, state])

    const getColor = (state: string) => {
        let color = "bg-gray-500";
        switch (state) {
            case "Running":
                color = "bg-blue-500";
                break;
            case "Boosting":
                color = "bg-purple-500";
                break;
            case "Braking":
                color = "bg-orange-500";
                break;
            case "Stopped":
                color = "bg-orange-800";
                break;
            case "Crashed":
                color = "bg-red-600";
                break;
            default:
                color = "bg-gray-500";
        }
        return color;
    }

    return (
        <div className="rounded-full">
            <div className="flex justify-between">
                <span className="">0m</span>
                <span className="font-extrabold text-sm mb-2">Vehicle Progress</span>
                <span className="">50m</span>
            </div>
            <div className="w-150 h-5 bg-gray-300 rounded-full mb-2 flex">
                {progress.map((info, idx) => {
                    const borderClasses = idx === 0 ? "rounded-l-full" : idx === 50 ? "rounded-r-full" : "";
                    return <div key={idx} className={`h-5 w-3 ${getColor(info?.state || "")} ${borderClasses}`}></div>
                })
                }
            </div>

        </div>
    )
}

export default memo(ProgressSegments)