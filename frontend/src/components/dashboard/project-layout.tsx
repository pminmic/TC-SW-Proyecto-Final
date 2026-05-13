import { useState } from "react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Card, CardContent } from "@/components/ui/card"
import ButtonArea from "@/components/dashboard/button-area"
import ChartsArea from "@/components/dashboard/charts-area"
import MessageArea from "./message-area"
import ModelArea from "./model-area"
import HeaderData from "../shared/header-data"
import type { ProjectLayoutProps } from "@/types/props"
import { useSimulator } from "@/hooks/use-simulator"
import { useCommand } from "@/hooks/use-command"


const ProjectLayout = ({ numLayout, variableSelected }: ProjectLayoutProps) => {

  const [wValue, setWValue] = useState([90])
  const [isWeigthSet, setIsWeightSet] = useState(false)
  const { payload, messages } = useSimulator()
  const { sendCommand } = useCommand()

  const lastData = payload.length > 0 ? payload[payload.length - 1] : null

  const handleSetWeight = () => {
    setIsWeightSet(true)
  }

  const handleReset = async () => {
    await sendCommand("reset")
    setIsWeightSet(false)
  }

  // Optimize excesive rerenderings
  const messageArea = <MessageArea messages={messages} />
  const buttonArea = <ButtonArea
    wValue={wValue}
    setWValue={setWValue}
    isWeightSet={isWeigthSet}
    handleSetWeight={handleSetWeight}
    handleReset={handleReset} />
  const chartArea = <ChartsArea
      variableSelected={variableSelected}
      payload={payload}
    />
  const headerData = <HeaderData payload={lastData} />

  const isCrashed = lastData?.state === "Crashed" ? "animate-pulse": ""

  if (numLayout === "model-view") {
    return (
      <div className={`w-full min-h-11/12 flex flex-col m-5 ${isCrashed}`}>
        {headerData}
        <Card className="w-full min-h-11/12">
          <CardContent className="h-full">
            <ResizablePanelGroup orientation="vertical" className="h-full">
              <ResizablePanel defaultSize="65%">
                <ModelArea payload={lastData} layout="model-view" />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize="30%" minSize="30%">
                <ResizablePanelGroup orientation="horizontal" className="h-full">
                  <ResizablePanel defaultSize="25%">
                    {messageArea}
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize="50%">
                    <ModelArea payload={lastData} layout="chart-view" />
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
      </div>
    )
  }
  else {
    return (
      <div className={`w-full min-h-11/12 flex flex-col m-5 ${isCrashed}`}>
        {headerData}
        <Card className="w-full min-h-11/12">
          <CardContent className="h-full">
            <ResizablePanelGroup orientation="horizontal" className="h-full">
              <ResizablePanel defaultSize="75%">
                <ResizablePanelGroup orientation="vertical" className="h-full">
                  <ResizablePanel>
                    {chartArea}
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize="25%" minSize="25%" maxSize="60%">
                <ResizablePanelGroup orientation="vertical" className="h-full">
                  <ResizablePanel defaultSize="40%">
                    {messageArea}
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                    <ResizablePanel>
                      <ModelArea payload={lastData} layout="chart-view" />
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
      </div>
    )
  }
}

export default ProjectLayout