import { useState, useMemo } from "react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import ButtonArea from "@/components/dashboard/button-area"
import ChartsArea from "@/components/dashboard/charts-area"
import MessageArea from "./message-area"
import ModelArea from "./model-area"
import { toast } from "sonner"
import HeaderData from "../shared/header-data"
import type { ProjectLayoutProps } from "@/types/props"
import { useSimulator } from "@/hooks/use-simulator"


const ProjectLayout = ({ numLayout, variableSelected }: ProjectLayoutProps) => {

  const [wValue, setWValue] = useState([90])
  const [isWeigthSet, setIsWeightSet] = useState(false)
  const { payload, messages } = useSimulator()

  const lastData = payload.length > 0 ? payload[payload.length - 1] : null

  const handleSetWeight = () => {
    setIsWeightSet(true)
  }

  const handleReset = async () => {

    try {
      const response = await fetch("http://localhost:8001/api/command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ "command": "RESET" })
      })

      if (!response.ok) {
        const errorText = await response.text()
        toast.error("Error resetting", { description: errorText })
      }
    }
    catch (error) {
      toast.error("Error resetting", { description: String(error) })
    }

    setIsWeightSet(false)
  }

  // Optimize excesive rerenderings
  const messageArea = useMemo(() => <MessageArea messages={messages} />, [messages])
  const modelArea = useMemo(() => <ModelArea payload={lastData} />, [payload])
  const buttonArea = useMemo(() => {
    return <ButtonArea
      wValue={wValue}
      setWValue={setWValue}
      isWeightSet={isWeigthSet}
      handleSetWeight={handleSetWeight}
      handleReset={handleReset} />
  }, [wValue, isWeigthSet])
  const chartArea = useMemo(() => {
    return <ChartsArea
      variableSelected={variableSelected}
      payload={payload}
    />
  }, [payload, variableSelected])
  const headerData = useMemo(() => <HeaderData payload={lastData} />, [lastData])

  if (numLayout === 1) {
    return (
      <Card className="w-full min-h-11/12 m-5">
        <CardHeader>
          {headerData}
        </CardHeader>
        <CardContent className="h-full">
          <ResizablePanelGroup orientation="vertical" className="h-full">
            <ResizablePanel defaultSize="65%">
              {chartArea}
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="35%" minSize="25%">
              <ResizablePanelGroup orientation="horizontal" className="h-full">
                <ResizablePanel defaultSize="25%">
                  {messageArea}
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize="50%">
                  {modelArea}
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize="25%" minSize="25%">
                  {buttonArea}
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
        <CardHeader>
          {headerData}
        </CardHeader>
        <CardContent className="h-full">
          <ResizablePanelGroup orientation="horizontal" className="h-full">
            <ResizablePanel defaultSize="75%">
              <ResizablePanelGroup orientation="vertical" className="h-full">
                <ResizablePanel defaultSize="50%">
                  {chartArea}
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize="50%">
                  {modelArea}
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="25%" minSize="25%" maxSize="60%">
              <ResizablePanelGroup orientation="vertical" className="h-full">
                <ResizablePanel defaultSize="65%">
                  {messageArea}
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize="35%" minSize="25%">
                  {buttonArea}
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