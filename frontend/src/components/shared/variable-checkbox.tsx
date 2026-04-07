import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem
} from "@/components/ui/sidebar"
import {
    Field,
    FieldLabel
} from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { IconChartColumn, IconChevronDown } from "@tabler/icons-react"

type VariableCheckboxProps = {
    voltageCheck: boolean,
    accelerationCheck: boolean,
    velocityCheck: boolean,
    forceCheck: boolean,
    intensityCheck: boolean,
    handleChangeSelected: (args: any) => void
}

const VariableCheckbox = ({voltageCheck, accelerationCheck, velocityCheck, forceCheck, intensityCheck, handleChangeSelected}: VariableCheckboxProps) => {

    return (
        <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
                <SidebarGroupLabel asChild>
                    <CollapsibleTrigger>
                        <IconChartColumn />
                        <span className="text-lg pl-2">
                            Variables
                        </span>
                        <IconChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent className="py-2 px-4">
                    <SidebarMenu>
                        <SidebarMenuItem className="mb-2">
                            <Field orientation="horizontal">
                                <Checkbox
                                    id="voltage-checkbox"
                                    checked={voltageCheck}
                                    onCheckedChange={() => handleChangeSelected({
                                        voltage: !voltageCheck,
                                        acceleration: accelerationCheck,
                                        velocity: velocityCheck,
                                        force: forceCheck,
                                        intensity: intensityCheck
                                    })}
                                />
                                <FieldLabel
                                    htmlFor="voltage-checkbox"
                                    className="font-normal text-sm"
                                >Voltage</FieldLabel>
                            </Field>
                        </SidebarMenuItem>
                        <SidebarMenuItem className="mb-2">
                            <Field orientation="horizontal">
                                <Checkbox
                                    id="acceleration-checkbox"
                                    checked={accelerationCheck}
                                    onCheckedChange={() => handleChangeSelected({
                                        voltage: voltageCheck,
                                        acceleration: !accelerationCheck,
                                        velocity: velocityCheck,
                                        force: forceCheck,
                                        intensity: intensityCheck
                                    })}
                                />
                                <FieldLabel
                                    htmlFor="acceleration-checkbox"
                                    className="font-normal text-sm"
                                >Acceleration</FieldLabel>
                            </Field>
                        </SidebarMenuItem>
                        <SidebarMenuItem className="mb-2">
                            <Field orientation="horizontal">
                                <Checkbox
                                    id="velocity-checkbox"
                                    checked={velocityCheck}
                                    onCheckedChange={() => handleChangeSelected({
                                        voltage: voltageCheck,
                                        acceleration: accelerationCheck,
                                        velocity: !velocityCheck,
                                        force: forceCheck,
                                        intensity: intensityCheck
                                    })}
                                />
                                <FieldLabel
                                    htmlFor="velocity-checkbox"
                                    className="font-normal text-sm"
                                >Velocity</FieldLabel>
                            </Field>
                        </SidebarMenuItem>
                        <SidebarMenuItem className="mb-2">
                            <Field orientation="horizontal">
                                <Checkbox
                                    id="force-checkbox"
                                    checked={forceCheck}
                                    onCheckedChange={() => handleChangeSelected({
                                        voltage: voltageCheck,
                                        acceleration: accelerationCheck,
                                        velocity: velocityCheck,
                                        force: !forceCheck,
                                        intensity: intensityCheck
                                    })}
                                />
                                <FieldLabel
                                    htmlFor="force-checkbox"
                                    className="font-normal text-sm"
                                >Force</FieldLabel>
                            </Field>
                        </SidebarMenuItem>
                        <SidebarMenuItem className="mb-2">
                            <Field orientation="horizontal">
                                <Checkbox
                                    id="intensity-checkbox"
                                    checked={intensityCheck}
                                    onCheckedChange={() => handleChangeSelected({
                                        voltage: voltageCheck,
                                        acceleration: accelerationCheck,
                                        velocity: velocityCheck,
                                        force: forceCheck,
                                        intensity: !intensityCheck
                                    })}
                                />
                                <FieldLabel
                                    htmlFor="intensity-checkbox"
                                    className="font-normal text-sm"
                                >Intensity</FieldLabel>
                            </Field>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    )
}

export default VariableCheckbox