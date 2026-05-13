import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import WeightInput from "@/components/shared/weight-input"
import type { ButtonAreaProps } from "@/types/props"
import { useCommand } from "@/hooks/use-command"
import { memo } from "react"
import { toast } from "sonner"

const ButtonArea = ({ wValue, setWValue, isWeightSet, handleSetWeight, handleReset }: ButtonAreaProps) => {

    const { sendCommand } = useCommand()
    const isInvalid = typeof wValue[0] === "string" && isNaN(parseFloat(wValue[0]))

    const handlePrecharge = async () => {
        if (!isWeightSet) {
            toast.warning("First set the weight")
        }
        else {
            await sendCommand("precharge")
        }
    }

    const handleStart = async () => {
        if (!isWeightSet) {
            toast.warning("First set the weight")
        }
        else {
            await sendCommand("start", wValue[0])
        }
    }

    const handleBreak = async () => {
        if (!isWeightSet) {
            toast.warning("First set the weight")
        }
        else {
            await sendCommand("brake")
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <ButtonGroup className="flex-wrap justify-center gap-4 mb-6">
                <ButtonGroup>
                    <Button
                        className="p-5 w-20 text-yellow-950 hover:bg-yellow-400/80 bg-yellow-400 border-2 border-yellow-500"
                        onClick={handlePrecharge}
                    >
                        PRECHARGE
                    </Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button
                        className="p-5 w-20 text-green-950 bg-green-500 border-2 border-green-600 hover:bg-green-600/80"
                        size="lg"
                        onClick={handleStart}
                    >
                        START
                    </Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button
                        className="p-5 w-20 text-red-950 border-2 border-red-600 hover:bg-red-500/80 bg-red-500"
                        onClick={handleBreak}
                    >
                        BRAKE
                    </Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button
                        className="p-5 w-20 text-slate-200 border-2 border-slate-700 bg-slate-600 hover:bg-slate-600/80"
                        onClick={() => handleReset()}
                    >
                        RESET
                    </Button>
                </ButtonGroup>
            </ButtonGroup>
            <WeightInput wValue={wValue[0]} setWValue={setWValue} isWeightSet={isWeightSet} isInvalid={isInvalid} />
            <div className="mt-4 flex justify-center">
                <Button
                    size="lg"
                    className="w-full max-w-md sm:w-auto"
                    onClick={() => handleSetWeight()}
                >
                    Set weight
                </Button>
            </div>
        </div >
    )
}

export default memo(ButtonArea)