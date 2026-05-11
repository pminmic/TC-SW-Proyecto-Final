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
import { IconChartColumn, IconChevronDown, IconInfoCircle } from "@tabler/icons-react"
import type { VariableCheckboxProps } from "@/types/props"


const variables = [
    { id: "voltage", label: "Voltage (V)", initial: "V" },
    { id: "acceleration", label: "Acceleration (a)", initial: "a" },
    { id: "velocity", label: "Velocity (v)", initial: "v" },
    { id: "force", label: "Force (F)", initial: "F" },
    { id: "intensity", label: "Intensity (I)", initial: "I" },
]

const VariableCheckbox = ({
    vrbles, handleChangeSelected
}: VariableCheckboxProps) => {

    const checks: Record<string, boolean> = {
        voltage: vrbles.voltage,
        acceleration: vrbles.acceleration,
        velocity: vrbles.velocity,
        force: vrbles.force,
        intensity: vrbles.intensity,
    }

    const buildPayload = (changedKey: string) =>
        Object.fromEntries(
            variables.map(v => [v.id, v.id === changedKey ? !checks[v.id] : checks[v.id]])
        )

    return (
        <Collapsible className="group/collapsible group-data-[collapsible=icon]:hidden">
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
                        <SidebarMenuItem>
                            <p className="mb-2 text-xs rounded-sm p-2 bg-sidebar-accent flex align-middle">
                                <IconInfoCircle className="inline mr-2 size-10" />
                                <span>Toggle each variable below to show or hide it in the current display.</span>
                            </p>
                        </SidebarMenuItem>
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
            </SidebarGroup>
        </Collapsible>
    )
}

export default VariableCheckbox