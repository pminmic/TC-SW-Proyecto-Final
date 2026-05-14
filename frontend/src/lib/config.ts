export const API_HTTP =
  import.meta.env.VITE_API_HTTP || ""

export const API_WS =
  import.meta.env.VITE_API_WS ||
  `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}`