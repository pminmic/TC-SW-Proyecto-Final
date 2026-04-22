import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { SidebarProvider } from "./components/ui/sidebar.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <SidebarProvider
        style={{
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "4rem", 
        } as React.CSSProperties
      }>
        <App />
      </SidebarProvider>
    </ThemeProvider>
  </StrictMode>
)
