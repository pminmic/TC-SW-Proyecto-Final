import { IconCalculator, IconChevronDown } from "@tabler/icons-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from "../ui/field"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import WeightInput from "./weight-input"
import type { CalculatedDistance } from "@/types/types"

const DistanceCalculator = () => {

    const [wValue, setWValue] = useState([90])
    const [position, setPosition] = useState([25])
    const [result, setResult] = useState<CalculatedDistance>(null)

    const handleSubmitDistance = (event: any) => {
        event.preventDefault()

        const getDistance = async () => {

            const response = await fetch(`http://localhost:8001/api/calculate?m=${wValue[0]}&d=${50-position[0]}`)

            if (response.ok) {
                const data = await response.json()
                setResult(data.braking_position_m)
            }
            else {
                setResult(await response.text())
            }


        }

        getDistance()
    }

    return (
        <Collapsible defaultOpen className="group/collapsible group-data-[collapsible=icon]:hidden">
            <SidebarGroup>
                <SidebarGroupLabel asChild>
                    <CollapsibleTrigger>
                        <IconCalculator />
                        <span className="text-lg pl-2">
                            Calculate distance
                        </span>
                        <IconChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                    <form
                        onSubmit={handleSubmitDistance}
                        className="m-2"
                    >
                        <FieldGroup>
                            <Field>
                                <div className="mx-auto grid gap-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <FieldLabel htmlFor="slider-distance">Position</FieldLabel>
                                        <span className="text-sm text-muted-foreground">
                                            <Input
                                                className="w-15 text-center"
                                                type="text"
                                                value={position[0]}
                                                onChange={(e: any) => {
                                                    const val = e.target.value
                                                    setPosition([val])
                                                }}
                                            />
                                            {" m"}
                                        </span>
                                    </div>
                                    <Slider
                                        id="slider-distance"
                                        value={position}
                                        onValueChange={setPosition}
                                        min={0}
                                        max={50}
                                        step={0.01}
                                    />
                                </div>
                            </Field>
                            <WeightInput wValue={wValue[0]} setWValue={setWValue} isWeightSet={false} isInvalid={false} />
                            <Field>
                                <Button type="submit">
                                    Calculate
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                    {result === null ? (
                        <></>
                    ) : (
                        typeof result == "number" ? (
                            <FieldLabel className="mt-5 p-2">
                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldTitle className="text-2xl">s = {result}</FieldTitle>
                                        <FieldDescription>Recommended stopping distance to reach the desired position</FieldDescription>
                                    </FieldContent>
                                </Field>
                            </FieldLabel>
                        ) : (
                            <Field className="mx-auto mt-5 p-5 bg-red-300/15 rounded-sm">
                                <FieldDescription className="text-red-400">{result}</FieldDescription>
                            </Field>
                        )
                    )}
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    )
}

export default DistanceCalculator