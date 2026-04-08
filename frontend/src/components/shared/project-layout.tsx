import { useState } from "react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import ButtonArea from "./button-area"
import ChartsArea from "./charts-area"
import MessageArea from "./message-area"
import ModelArea from "./model-area"

type ProjectLayoutProps = {
  numLayout: number,
  variableSelected: any
}

const ProjectLayout = ({ numLayout, variableSelected }: ProjectLayoutProps) => {

  type PayloadType = any

  const [wValue, setWValue] = useState([90])
  const [isWeigthSet, setIsWeightSet] = useState(false)
  const [payload, setPayload] = useState<PayloadType[]>([])

  const socket = new WebSocket("ws://localhost:5001/backend/stream")

  socket.onmessage = (event: MessageEvent) => {
    try {
      const jsonData = JSON.parse(event.data)

      if (jsonData.topic === "data") {
        setPayload(prev => {
          const payload = jsonData.payload as PayloadType
          const next = [...prev, payload]
          if (next.length > 10) next.shift()
          return next
        })
      }
    }
    catch (e: any) {
      console.error(`Error al parsear: ${e}`)
    }
  }

  const handleSetWeight = () => {
    setIsWeightSet(true)
  }

  const handleReset = () => {
    setIsWeightSet(false)
  }

  if (numLayout === 1) {
    return (
      <Card className="w-full min-h-11/12 m-5">
        <CardHeader>
          Hola babay
        </CardHeader>
        <CardContent className="h-full">
          <ResizablePanelGroup orientation="vertical" className="h-full">
            <ResizablePanel defaultSize="65%">
              <ChartsArea
                variableSelected={variableSelected}
                payload={payload}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="35%" minSize="25%">
              <ResizablePanelGroup orientation="horizontal" className="h-full">
                <ResizablePanel defaultSize="25%">
                  <MessageArea />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize="50%">
                  <ModelArea />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize="25%" minSize="25%">
                  <ButtonArea
                    wValue={wValue}
                    setWValue={setWValue}
                    isWeightSet={isWeigthSet}
                    handleSetWeight={handleSetWeight}
                    handleReset={handleReset}
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </CardContent>
      </Card>
    )
  }
  else {
    return (
      <Card className="w-full min-h-11/12 m-5">
        <CardContent className="h-full">
          <ResizablePanelGroup orientation="horizontal" className="h-full">
            <ResizablePanel defaultSize="75%">
              <ResizablePanelGroup orientation="vertical" className="h-full">
                <ResizablePanel defaultSize="50%">
                  <ChartsArea
                    variableSelected={variableSelected}
                    payload={payload}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize="50%">
                  <ModelArea />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="25%" minSize="25%" maxSize="60%">
              <ResizablePanelGroup orientation="vertical" className="h-full">
                <ResizablePanel defaultSize="65%">
                  <MessageArea />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize="35%" minSize="25%">
                  <ButtonArea
                    wValue={wValue}
                    setWValue={setWValue}
                    isWeightSet={isWeigthSet}
                    handleSetWeight={handleSetWeight}
                    handleReset={handleReset}
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </CardContent>
      </Card>
    )
  }
}

export default ProjectLayout