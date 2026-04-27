import MessageContent from "./message-content"
import type { MessageAreaProps } from "@/types/props"


const MessageArea = ({ messages }: MessageAreaProps) => {


    return (
        <div className="h-full w-full p-2 flex flex-col align-center overflow-y-auto">
            {messages.map(([type, content], idx) => (
                <MessageContent key={idx} type={type} content={content} />
            ))}
        </div>
    
)
}

export default MessageArea