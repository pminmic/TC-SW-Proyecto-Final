import MessageContent from "../shared/message-content"
import type { MessageAreaProps } from "@/types/props"


const MessageArea = ({ messages }: MessageAreaProps) => {


    return (
        <div className="h-full w-full p-2 flex flex-col align-center overflow-y-auto">
            {messages.length === 0 ? (
                <span className="flex h-full w-full items-center justify-center text-lg">
                    No messages received yet.
                </span>
            ) : messages.map(([type, content], idx) => (
                <MessageContent key={idx} type={type} content={content} />
            ))}
        </div>

    )
}

export default MessageArea