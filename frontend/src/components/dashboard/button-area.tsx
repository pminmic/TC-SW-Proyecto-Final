import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import WeightInput from "@/components/shared/weight-input"
import type { ButtonAreaProps } from "@/types/props"
import { useCommand } from "@/hooks/use-command"
import { memo } from "react"

const ButtonArea = ({ wValue, setWValue, isWeightSet, handleSetWeight, handleReset }: ButtonAreaProps) => {

    const isInvalid = typeof wValue[0] === "string" && isNaN(parseFloat(wValue[0]))

    const handlePrecharge = () => {
        useCommand("precharge")
    }

    const handleStart = async () => {
        useCommand("start", wValue[0])
    }

    const handleBreak = async () => {
        useCommand("brake")
    }

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <ButtonGroup className="flex-wrap justify-center gap-4 mb-6">
                <ButtonGroup>
                    <Button
                        disabled={!isWeightSet}
                        className="p-5 w-20 text-white/50 hover:bg-amber-300/40 bg-amber-400/30"
                        onClick={handlePrecharge}
                    >
                        PRECHARGE
                    </Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button
                        disabled={!isWeightSet}
                        className="p-5 w-20 bg-green-500/20 hover:bg-green-700/50 text-green-400 "
                        size="lg"
                        onClick={handleStart}
                    >
                        START
                    </Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button
                        disabled={!isWeightSet}
                        className="p-5 w-20"
                        variant="destructive"
                        onClick={handleBreak}
                    >
                        BRAKE
                    </Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button
                        className="p-5 w-20"
                        variant="secondary"
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
                    disabled={isWeightSet}
                    onClick={() => handleSetWeight()}
                >
                    Set weight
                </Button>
            </div>
        </div >
    )
}

export default memo(ButtonArea)