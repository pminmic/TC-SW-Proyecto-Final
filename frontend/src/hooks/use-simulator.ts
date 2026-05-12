import { useEffect, useRef, useState } from "react"
import type { MessageType, PayloadType } from "@/types/types"
import { toast } from "sonner"
import { API_WS } from "@/lib/config"

export function useSimulator() {
  const [payload, setPayload] = useState<PayloadType[]>([])
  const [messages, setMessages] = useState<MessageType[]>([])

  // Avoid rerendering with every new WS
  const socketRef = useRef<WebSocket | null>(null)

  // Buffer incoming payloads to batch state updates and avoid excessive rerenders
  const bufferRef = useRef<PayloadType[]>([])
  const timerRef = useRef<number | null>(null)
  const FLUSH_INTERVAL_MS = 250 // flush every 250ms (4 Hz), same as simulator update rate

  useEffect(() => {
    // Evita doble conexión si ya existe (por StrictMode en dev)
    if (socketRef.current) return

    const socket = new WebSocket(`${API_WS}/backend/stream`)
    socketRef.current = socket

    // Flush buffer at a fixed interval to limit UI updates and CPU work
    const flush = () => {
      const buf = bufferRef.current
      if (buf.length === 0) return
      bufferRef.current = []  // clear before setState
      setPayload(prev => {
        const combined = [...prev, ...buf]
        return combined.length > 20 ? combined.slice(-20) : combined
      })
    }

    // Start periodic flush
    timerRef.current = window.setInterval(flush, FLUSH_INTERVAL_MS)

    socket.onmessage = (event: MessageEvent) => {
      try {
        const jsonData = JSON.parse(event.data)
        if (jsonData.topic === "data") {
          // Buffer incoming payloads and let the RAF flush handle state updates
          bufferRef.current.push(jsonData.payload as PayloadType)
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
      // Remove handlers and close socket safely
      try {
        socket.onmessage = null
        socket.onerror = null
        if (timerRef.current != null) clearInterval(timerRef.current)
        timerRef.current = null
        socketRef.current?.close()
      } catch (e) {
        console.error("Error closing WebSocket:", e)
      } finally {
        socketRef.current = null
        bufferRef.current = []
      }
    }
  }, [])

  return { payload, messages }
}