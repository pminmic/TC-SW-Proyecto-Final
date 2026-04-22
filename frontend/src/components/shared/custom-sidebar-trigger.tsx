import { useSidebar } from "@/components/ui/sidebar";
import { IconRocket } from "@tabler/icons-react";


const CustomSidebarTrigger = () => {

    const { toggleSidebar } = useSidebar();

    return (
        <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-accent"
        >
            <IconRocket className="h-5 w-5" />
        </button>

    )
}

export default CustomSidebarTrigger