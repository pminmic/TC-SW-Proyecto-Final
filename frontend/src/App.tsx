import { useState } from "react";
import ProjectSidebar from "./components/shared/project-sidebar"
import ProjectLayout from "./components/shared/project-layout"
import type { VariableSelected } from "./types/types";

export function App() {

  const [numLayout, setNumLayout] = useState(1);
  const [variableSelected, setVariableSelected] = useState<VariableSelected>({
    voltage: true,
    acceleration: false,
    velocity: true,
    force: false,
    intensity: false
  })


  const handleChangeLayout = (num: number) => {
    setNumLayout(num)
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
