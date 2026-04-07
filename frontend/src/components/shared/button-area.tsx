import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

type ButtonAreaProps = {
    wValue: number[],
    setWValue: (num: number[]) => void,
    isWeightSet: boolean,
    handleSetWeight: () => void,
    handleReset: () => void
}

const ButtonArea = ({ wValue, setWValue, isWeightSet, handleSetWeight, handleReset }: ButtonAreaProps) => {

        return (
        <div className="flex h-full flex-col items-center justify-center overflow-hidden">
            <div className="flex items-center justify-center m-8">
                <ButtonGroup orientation="horizontal">
                    <Button  disabled={!isWeightSet}
                        className="text-sm px-3 py-5 text-amber-700 hover:bg-amber-400 bg-amber-500"
                    >PRECHARGE</Button>
                    <ButtonGroupSeparator />
                    <Button  disabled={!isWeightSet}
                        className="text-sm px-3 py-5 bg-green-800 hover:bg-green-700 text-green-300"
                        size="lg"
                    >START</Button>
                    <ButtonGroupSeparator />
                    <Button  disabled={!isWeightSet}
                        className="text-sm px-3 py-5" 
                        variant="destructive">BREAK</Button>
                    <ButtonGroupSeparator />
                    <Button 
                        className="text-sm px-3 py-5" 
                        variant="secondary"
                        onClick={() => handleReset()}    
                    >RESET</Button>
                </ButtonGroup>
            </div>
            <div className="mx-auto grid min-w-xs gap-3">
                <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="slider-weight">Weight</Label>
                    <span className="text-sm text-muted-foreground">
                        {wValue}
                    </span>
                </div>
                <Slider
                    id="slider-weight"
                    value={wValue}
                    onValueChange={setWValue}
                    min={30}
                    max={300}
                    step={1}
                />
            </div>
            <div className="flex items-center justify-center m-8">
                <Button 
                    size="lg" 
                    variant="outline"
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