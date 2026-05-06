import ProgressSegments from "./progress-segments"
import type { ProgressInfo } from "@/types/types"
import type { ModelAreaProps } from "@/types/props"

const ModelArea = ( { payload }: ModelAreaProps) => {

    const progressInfo: ProgressInfo = {
        position_m: payload?.position_m,
        state: payload?.state,
    }

    return (
        <div className="flex flex-col h-full items-center justify-center p-6">
            <span className="font-semibold">Modelo 3D</span>
            <ProgressSegments progressInfo={progressInfo} />
        </div>
    )
}

export default ModelArea