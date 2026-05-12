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
import { IconChevronDown, IconNotebook, IconLayoutDashboard, IconBell, IconTrain, IconChartLine } from "@tabler/icons-react"
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
                    <Collapsible defaultOpen className="group/collapsible group-data-[collapsible=icon]:hidden">
                        <SidebarGroup>
                            <SidebarGroupLabel asChild>
                                <CollapsibleTrigger>
                                    <IconNotebook />
                                    <span className="text-lg pl-2">Instructions</span>
                                    <IconChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent>
                                <p className="my-2 mx-3 text-xs rounded-sm p-2 bg-sidebar-accent flex flex-col align-middle justify-center text-justify gap-y-2">
                                    <span><strong>1.</strong> To start the simulator, first set the <strong>weight</strong>.</span>
                                    <span><strong>2.</strong> Then press <strong>PRECHARGE</strong>, and when it's ready, press <strong>START</strong>.</span>
                                    <span><strong>3.</strong> Enjoy the simulation! Be careful — don't crash the vehicle.</span>
                                    <span><IconBell className="inline size-4" /> You can personalize the graphics, calculate the stopping distance and change the layout.</span>
                                </p>
                                <div>

                                </div>
                            </CollapsibleContent>
                        </SidebarGroup>
                    </Collapsible>
                    <Separator className="group-data-[collapsible=icon]:hidden" />
                    <VariableCheckbox
                        vrbles={variableSelected}
                        handleChangeSelected={handleChangeVariableSelected}
                    />
                    <Separator className="group-data-[collapsible=icon]:hidden" />
                    <DistanceCalculator />                 
                </SidebarContent>
                <SidebarFooter className="group-data-[collapsible=icon]:hidden">
                    <Collapsible className="group/collapsible">
                        <SidebarGroup>
                            <SidebarGroupLabel asChild>
                                <CollapsibleTrigger>
                                    <IconLayoutDashboard />
                                    <span className="text-sm pl-2">Layouts</span>
                                    <IconChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton isActive={numLayout === "chart-view"} onClick={() => handleChangeLayout("chart-view")}>
                                            Charts View
                                            <IconChartLine className="inline mr-2" />
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton isActive={numLayout === "model-view"} onClick={() => handleChangeLayout("model-view")}>
                                            Model View
                                            <IconTrain className="inline mr-2" />
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