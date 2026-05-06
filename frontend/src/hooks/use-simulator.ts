import { useEffect, useRef, useState } from "react"
import type { MessageType, PayloadType } from "@/types/types"
import { toast } from "sonner"

export function useSimulator() {
  const [payload, setPayload] = useState<PayloadType[]>([])
  const [messages, setMessages] = useState<MessageType[]>([])

  // Avoid rerendering with every new WS
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // Evita doble conexión si ya existe (por StrictMode en dev)
    if (socketRef.current) return

    const socket = new WebSocket("ws://localhost:5001/backend/stream")
    socketRef.current = socket

    socket.onmessage = (event: MessageEvent) => {
      try {
        const jsonData = JSON.parse(event.data)
        if (jsonData.topic === "data") {
          setPayload(prev => {
            const next = [...prev, jsonData.payload as PayloadType]
            if (next.length > 20) next.shift()
            return next
          })
        }
        if (jsonData.topic === "message") {
          const { type, content } = jsonData.payload
          setMessages(prev => {
            const next = [[type, content], ...prev] as MessageType[]
            if (next.length > 50) next.pop()
            return next
          })
          
          if (jsonData.payload.type === "error") {
            console.log("Showing error toast:", jsonData.payload.content)
            toast.error("Error", { description: jsonData.payload.content })
          }
          else if (jsonData.payload.type === "success") {
            console.log("Showing success toast:", jsonData.payload.content)
            toast.success("Success", { description: jsonData.payload.content })
          }
          else if (jsonData.payload.type === "info") {
            console.log("Showing info toast:", jsonData.payload.content)
            toast.info("Info", { description: jsonData.payload.content })
          }
          else if (jsonData.payload.type === "critical") {
            console.log("Showing warning toast:", jsonData.payload.content)
            toast.warning("Critical", { description: jsonData.payload.content })
          }
        }
      } catch (e) {
        console.error("Error parsing WS message:", e)
      }
    }

    socket.onerror = (e) => console.error("WebSocket error:", e)

    return () => {
      socket.close()
      socketRef.current = null
    }
  }, [])

  return { payload, messages }
}