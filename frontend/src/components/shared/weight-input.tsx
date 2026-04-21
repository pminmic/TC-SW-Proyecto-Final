import { Field, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type WeightInputProps = {
    wValue: number,
    setWValue: (num: number[]) => void,
    isWeightSet: boolean,
    isInvalid: boolean
}

const WeightInput = ({ wValue, setWValue, isWeightSet, isInvalid }: WeightInputProps) => {

    return (
        <div className="w-full max-w-sm">
            <Field data-invalid={isInvalid || undefined} className="flex flex-col items-center gap-3">
                <div className="flex flex-row items-center gap-3 justify-center">
                    <Label htmlFor="input-weight" className="font-medium text-sm">Weight:</Label>
                    <Input
                        id="input-weight"
                        className="w-20 text-center"
                        disabled={isWeightSet}
                        type="text"
                        value={wValue}
                        onChange={(e: any) => {
                            const val = e.target.value
                            setWValue(val)
                        }}
                    />
                    <span className="font-medium text-sm">kg</span>
                </div>
                <FieldDescription className="text-center text-xs">
                    Weight in kg. Must be a number.
                </FieldDescription>
            </Field>
        </div>
    )
}

export default WeightInput