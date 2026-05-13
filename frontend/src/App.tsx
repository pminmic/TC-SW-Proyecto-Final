import { useState } from "react";
import ProjectSidebar from "@/components/dashboard/project-sidebar"
import ProjectLayout from "@/components/dashboard/project-layout"
import type { VariableSelected, LayoutType } from "./types/types";

export function App() {

  const [numLayout, setNumLayout] = useState<LayoutType>("chart-view");
  const [variableSelected, setVariableSelected] = useState<VariableSelected>({
    voltage: true,
    acceleration: true,
    velocity: true,
    force: true,
    intensity: true
  })


  const handleChangeLayout = (l: LayoutType) => {
    setNumLayout(l)
  }

  return (
    <>
      <ProjectSidebar 
        handleChangeLayout={handleChangeLayout}
        numLayout={numLayout}
        handleChangeVariableSelected={setVariableSelected}
        variableSelected={variableSelected}
      />
      <ProjectLayout 
        numLayout={numLayout} 
        variableSelected={variableSelected}
      />
    </>
  )
}

export default App
