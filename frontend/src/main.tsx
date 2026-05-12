import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { SidebarProvider } from "./components/ui/sidebar.tsx"
import { Toaster } from "sonner"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider
      defaultTheme="system"
    >
      <SidebarProvider
        style={{
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "4rem",
        } as React.CSSProperties
        }>
        <App />
        <Toaster position="bottom-center" />
      </SidebarProvider>
    </ThemeProvider>
  </StrictMode>
)
