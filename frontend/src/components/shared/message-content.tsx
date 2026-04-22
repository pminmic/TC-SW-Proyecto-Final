import { IconAlertTriangle, IconCircleDashedCheck, IconCircleX, IconInfoOctagon,  } from "@tabler/icons-react"

type MessageContentProps = {
    type: string,
    content: string
}

const MessageContent = ({ type, content }: MessageContentProps) => {

    let color = ""
    let icon = null

    if (type === "error") {
        color = "border-red-400/20 text-red-700 bg-red-700/10"
        icon = <IconCircleX className="size-4 mr-2" />
    }
    else if (type === "success") {
        color = "border-green-400/20 text-green-700 bg-green-700/10"
        icon = <IconCircleDashedCheck className="size-4 mr-2" />
    }
    else if (type === "info") {
        color = "border-blue-400/20 text-blue-700 bg-blue-700/10"
        icon = <IconInfoOctagon className="size-4 mr-2" />
    }
    else if (type === "critical") {
        color = "border-yellow-400/20 text-yellow-700 bg-yellow-700/10"
        icon = <IconAlertTriangle className="size-4 mr-2" />
    }

    

    return (
        <div className={"p-2 flex items-center border rounded-sm m-1 " + color}>
            {icon}
            <div>
                <span className="font-semibold">{type.toUpperCase()}:</span> {content}
            </div>
        </div>
    )
}

export default MessageContent