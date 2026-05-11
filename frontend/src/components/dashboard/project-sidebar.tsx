import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel
} from "@/components/ui/sidebar"
import { IconChevronDown } from "@tabler/icons-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import VariableCheckbox from "../shared/variable-checkbox"
import { Separator } from "@/components/ui/separator"
import DistanceCalculator from "../shared/distance-calculator"
import CustomSidebarTrigger from "../shared/custom-sidebar-trigger"
import type { ProjectSidebarProps } from "@/types/props"

const ProjectSidebar = ({ handleChangeLayout, numLayout, handleChangeVariableSelected, variableSelected }: ProjectSidebarProps) => {

    return (
        <>
            <Sidebar collapsible="icon">
                <SidebarHeader className="text-xl flex-row items-center ml-2 mt-2">

                    <CustomSidebarTrigger />

                    <span className="group-data-[collapsible=icon]:hidden">Bancada Booster</span>
                </SidebarHeader>
                <SidebarContent>
                    <VariableCheckbox
                        vrbles={variableSelected}
                        handleChangeSelected={handleChangeVariableSelected}
                    />
                    <Separator />
                    <DistanceCalculator />
                </SidebarContent>
                <SidebarFooter className="group-data-[collapsible=icon]:hidden">
                    <Collapsible defaultOpen className="group/collapsible">
                        <SidebarGroup>
                            <SidebarGroupLabel asChild>
                                <CollapsibleTrigger>
                                    <span className="text-sm">Layouts</span>
                                    <IconChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton isActive={numLayout === "chart-view"} onClick={() => handleChangeLayout("chart-view")}>
                                            Charts View
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton isActive={numLayout === "model-view"} onClick={() => handleChangeLayout("model-view")}>
                                            Model View
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </CollapsibleContent>
                        </SidebarGroup>
                    </Collapsible>
                </SidebarFooter>
                {/* <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                Username
                            </SidebarMenuButton>
                            <SidebarMenuBadge>24</SidebarMenuBadge>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter> */}
            </Sidebar>
        </>
    )
}

export default ProjectSidebar