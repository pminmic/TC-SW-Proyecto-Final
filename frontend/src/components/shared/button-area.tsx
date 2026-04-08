import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "../ui/input"

type ButtonAreaProps = {
    wValue: number[],
    setWValue: (num: number[]) => void,
    isWeightSet: boolean,
    handleSetWeight: () => void,
    handleReset: () => void
}

const ButtonArea = ({ wValue, setWValue, isWeightSet, handleSetWeight, handleReset }: ButtonAreaProps) => {
    
    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="flex w-full justify-center md:my-5">
                <div className="grid xl:grid-cols-4  max-w-md gap-2">
                    <Button
                        disabled={!isWeightSet}
                        className="text-sm py-5 text-amber-700 hover:bg-amber-400 bg-amber-500 sm:w-auto"
                    >
                        PRECHARGE
                    </Button>

                    <Button
                        disabled={!isWeightSet}
                        className="text-sm py-5 bg-green-800 hover:bg-green-700 text-green-300 sm:w-auto"
                        size="lg"
                    >
                        START
                    </Button>

                    <Button
                        disabled={!isWeightSet}
                        className="text-sm py-5 sm:w-auto"
                        variant="destructive"
                    >
                        BREAK
                    </Button>

                    <Button
                        className="text-sm py-5 sm:w-auto"
                        variant="secondary"
                        onClick={() => handleReset()}
                    >
                        RESET
                    </Button>
                </div>
            </div>

            <div className="mx-auto grid w-full max-w-md gap-3">
                <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="slider-weight">Weight</Label>
                    <span className="text-sm text-muted-foreground">
                        <Input
                            className="w-15 text-center"
                            disabled={isWeightSet}
                            type="text"
                            value={wValue[0]}
                            onChange={(e: any) => {
                                const val = e.target.value
                                setWValue([val])
                            }}
                        />
                        {" kg"}
                    </span>
                </div>

                <Slider
                    id="slider-weight"
                    value={wValue}
                    onValueChange={setWValue}
                    disabled={isWeightSet}
                    min={30}
                    max={300}
                    step={0.01}
                />
            </div>

            <div className="mt-4 flex justify-center">
                <Button
                    size="lg"
                    variant="outline"
                    className="w-full max-w-md sm:w-auto"
                    disabled={isWeightSet}
                    onClick={() => handleSetWeight()}
                >
                    Set weight
                </Button>
            </div>
        </div>
    )
}

export default ButtonArea