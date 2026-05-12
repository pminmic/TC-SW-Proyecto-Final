import { toast } from "sonner"
import type { useCommandTypes } from "../types/types"
import { API_HTTP } from "@/lib/config"
import { useCallback } from "react"

export const useCommand = () => {
    const sendCommand = useCallback(async (type: useCommandTypes, mass: number = 0) => {
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

            const response = await fetch(`${API_HTTP}/api/command`, {
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
    }, [])
    return { sendCommand }
}