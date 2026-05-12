import ProgressSegments from "@/components/shared/progress-segments"
import type { ProgressInfo } from "@/types/types"
import type { ModelAreaProps } from "@/types/props"
import { memo, useMemo } from "react"
import ModelViewer from "../shared/model-viewer"

const ModelArea = ({ payload }: ModelAreaProps) => {

    if (payload === null) {
        return <div className="w-full flex-1 min-h-[200px]">
            <ModelViewer />
        </div>
    }

    const progressInfo: ProgressInfo = useMemo(() => {
        return {
            position_m: payload?.position_m,
            state: payload?.state,
        }
    }, [payload?.position_m, payload?.state])

    return (
        <div className="flex flex-col h-full items-center justify-between p-6">
            {/* <span className="font-semibold">Modelo 3D</span> */}
            <ProgressSegments progressInfo={progressInfo} />
            <div className="w-full flex-1 min-h-[200px]">
                <ModelViewer />
            </div>
        </div>
    )
}

export default memo(ModelArea)