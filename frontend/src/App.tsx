import { useState } from "react";
import ProjectSidebar from "./components/shared/project-sidebar"
import ProjectLayout from "./components/shared/project-layout"
import { SidebarInset } from "./components/ui/sidebar"

export function App() {

  const [numLayout, setNumLayout] = useState(1);

  const handleChangeLayout = (num: number) => {
    setNumLayout(num)
  }

  return (
    <>
      <ProjectSidebar 
        handleChangeLayout={handleChangeLayout}
        numLayout={numLayout}
      />
      <ProjectLayout numLayout={numLayout} />
    </>
  )
}

export default App
