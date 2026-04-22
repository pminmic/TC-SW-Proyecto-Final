import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { toast } from "sonner"
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

    const handlePrecharge = async () => {
        try {
            const response = await fetch("http://localhost:8001/api/command", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "command": "PRECHARGE"
                })
            })

            if (!response.ok) {
                const errorText = await response.text()
                toast.error("Error precharging", { description: errorText })
            }

        } catch (error) {
            toast.error("Error precharging", { description: String(error) })
        }
    }

    const handleStart = async () => {
        try {
            const response = await fetch("http://localhost:8001/api/command", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "command": "START",
                    "payload": {
                        "mass": wValue[0]
                    }
                })
            })

            if (!response.ok) {
                const errorText = await response.text()
                toast.error("Error starting", { description: errorText })
            }

        } catch (error) {
            toast.error("Error starting", {description: String(error)})
        }
    }

    const handleBreak = async () => {
        try {
            const response = await fetch("http://localhost:8001/api/command", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "command": "BRAKE" })
            })

            if (!response.ok) {
                const errorText = await response.text()
                toast.error("Error braking", { description: errorText })
            }

        } catch (error) {
            toast.error("Error braking", { description: String(error) })
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <ButtonGroup className="flex-wrap justify-center gap-4 mb-6">
                <ButtonGroup>
                    <Button
                        disabled={!isWeightSet}
                        className="p-5 w-20 text-amber-700 hover:bg-amber-400 bg-amber-500"
                        onClick={handlePrecharge}
                    >
                        PRECHARGE
                    </Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button
                        disabled={!isWeightSet}
                        className="p-5 w-20 bg-green-800 hover:bg-green-700 text-green-300 "
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

export default ButtonArea