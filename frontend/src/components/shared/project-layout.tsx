import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

type ProjectLayoutProps = {
  numLayout: number
}

const ProjectLayout = ({ numLayout }: ProjectLayoutProps) => {

  if (numLayout === 1) {
    return (
      <Card className="w-full min-h-screen">
        <CardContent className="h-full">
          <ResizablePanelGroup orientation="vertical" className="h-full">
            <ResizablePanel defaultSize="65%">
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Gráficas</span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="35%">
              <ResizablePanelGroup orientation="horizontal" className="h-full">
                <ResizablePanel defaultSize="25%">
                  <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Mensajes</span>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize="50%">
                  <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Modelo 3D</span>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize="25%">
                  <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Botones</span>
                  </div>
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
      <Card className="w-full min-h-screen">
        <CardContent className="h-full">
          <ResizablePanelGroup orientation="horizontal" className="h-full">
            <ResizablePanel defaultSize="90%">
              <ResizablePanelGroup orientation="vertical" className="h-full">
                <ResizablePanel defaultSize="50%">
                  <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Gráficas</span>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize="50%">
                  <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Modelo 3D</span>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="10%">
              <ResizablePanelGroup orientation="vertical" className="h-full">
                <ResizablePanel defaultSize="65%">
                  <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Mensajes</span>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize="35%">
                  <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Botones</span>
                  </div>
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