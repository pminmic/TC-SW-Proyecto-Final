import { useState } from "react";
import ProjectSidebar from "./components/shared/project-sidebar"
import ProjectLayout from "./components/shared/project-layout"

export function App() {

  const [numLayout, setNumLayout] = useState(1);
  const [variableSelected, setVariableSelected] = useState({
    voltage: false,
    acceleration: false,
    velocity: false,
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
