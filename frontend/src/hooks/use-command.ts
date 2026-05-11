import { toast } from "sonner"

type useCommandTypes = "precharge" | "start" | "brake" | "reset"

export const useCommand = async (type: useCommandTypes, mass: number = 0) => {
    try {
        const command = type.toUpperCase()
        let body = JSON.stringify({ "command": "NONE" })

        if (type == "start") {
            body = JSON.stringify({
                "command": command,
                "payload": {
                    "mass": mass
                }
            })
        }
        else {
            body = JSON.stringify({
                "command": command
            })
        }

        const response = await fetch("http://localhost:8001/api/command", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body
        })

        if (!response.ok) {
            const errorText = await response.text()
            toast.error(`Error at command ${type}`, { description: errorText })
        }
    } catch (error) {
        toast.error(`Error at command ${type}`, { description: String(error) })
    }
}