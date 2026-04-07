import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarRail,
    SidebarMenuBadge,
    SidebarGroup,
    SidebarGroupLabel
} from "@/components/ui/sidebar"
import { IconRocket } from "@tabler/icons-react"

type ProjectSidebarProps = {
    handleChangeLayout: (num: number) => void,
    numLayout: number
}

const ProjectSidebar = ({ handleChangeLayout, numLayout }: ProjectSidebarProps) => {

    return (
        <>
            <Sidebar>
                <SidebarHeader className="text-xl flex-row items-center ml-2 mt-2">
                    <IconRocket />
                    <span className="ml-2">Bancada Booster</span>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Layouts</SidebarGroupLabel>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton isActive={numLayout === 1} onClick={() => handleChangeLayout(1)}>
                                    Layout 1
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton isActive={numLayout === 2} onClick={() => handleChangeLayout(2)}>
                                    Layout 2
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
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