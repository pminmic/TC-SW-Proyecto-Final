import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import WeightInput from "./weight-input"

type ButtonAreaProps = {
    wValue: number[],
    setWValue: (num: number[]) => void,
    isWeightSet: boolean,
    handleSetWeight: () => void,
    handleReset: () => void
}

const ButtonArea = ({ wValue, setWValue, isWeightSet, handleSetWeight, handleReset }: ButtonAreaProps) => {

    const isInvalid = typeof wValue[0] === "string" && isNaN(parseFloat(wValue[0]))

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <ButtonGroup className="flex-wrap justify-center gap-4 mb-6">
                <ButtonGroup>
                    <Button
                        disabled={!isWeightSet}
                        className="p-5 w-20 text-amber-700 hover:bg-amber-400 bg-amber-500"
                    >
                        PRECHARGE
                    </Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button
                        disabled={!isWeightSet}
                        className="p-5 w-20 bg-green-800 hover:bg-green-700 text-green-300 "
                        size="lg"
                    >
                        START
                    </Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button
                        disabled={!isWeightSet}
                        className="p-5 w-20"
                        variant="destructive"
                    >
                        BREAK
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

export default ButtonArea