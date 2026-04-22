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

const variables = [
    { id: "voltage",      label: "Voltage",      initial: "V" },
    { id: "acceleration", label: "Acceleration",  initial: "A" },
    { id: "velocity",     label: "Velocity",      initial: "v" },
    { id: "force",        label: "Force",         initial: "F" },
    { id: "intensity",    label: "Intensity",     initial: "I" },
]

const VariableCheckbox = ({
    voltageCheck,
    accelerationCheck,
    velocityCheck,
    forceCheck,
    intensityCheck,
    handleChangeSelected
}: VariableCheckboxProps) => {

    const checks: Record<string, boolean> = {
        voltage:      voltageCheck,
        acceleration: accelerationCheck,
        velocity:     velocityCheck,
        force:        forceCheck,
        intensity:    intensityCheck,
    }

    const buildPayload = (changedKey: string) =>
        Object.fromEntries(
            variables.map(v => [v.id, v.id === changedKey ? !checks[v.id] : checks[v.id]])
        )

    return (
        <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>

                {/* ── Trigger: siempre visible ── */}
                <SidebarGroupLabel asChild>
                    <CollapsibleTrigger>
                        <IconChartColumn />
                        {/* Texto y flecha solo en modo expandido */}
                        <span className="text-lg pl-2 group-data-[collapsible=icon]:hidden">
                            Variables
                        </span>
                        <IconChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
                    </CollapsibleTrigger>
                </SidebarGroupLabel>

                {/* ── Vista EXPANDIDA: checkboxes con texto completo ── */}
                <CollapsibleContent className="py-2 px-4 group-data-[collapsible=icon]:hidden">
                    <SidebarMenu>
                        {variables.map(v => (
                            <SidebarMenuItem key={v.id} className="mb-2">
                                <Field orientation="horizontal">
                                    <Checkbox
                                        id={`${v.id}-checkbox`}
                                        checked={checks[v.id]}
                                        onCheckedChange={() => handleChangeSelected(buildPayload(v.id))}
                                    />
                                    <FieldLabel
                                        htmlFor={`${v.id}-checkbox`}
                                        className="font-normal text-sm"
                                    >
                                        {v.label}
                                    </FieldLabel>
                                </Field>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </CollapsibleContent>

                {/* ── Vista COLAPSADA: checkbox + inicial, sin CollapsibleContent ── */}
                <div className="hidden group-data-[collapsible=icon]:flex flex-col items-center gap-2 py-2">
                    {variables.map(v => (
                        <div key={v.id} className="flex items-center gap-2">
                            <Checkbox
                                id={`${v.id}-checkbox-mini`}
                                checked={checks[v.id]}
                                onCheckedChange={() => handleChangeSelected(buildPayload(v.id))}
                            />
                            <span className="text-[10px] font-medium text-muted-foreground leading-none">
                                {v.initial}
                            </span>
                        </div>
                    ))}
                </div>

            </SidebarGroup>
        </Collapsible>
    )
}

export default VariableCheckbox