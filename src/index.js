import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./index.css"
import { ThemeProvider } from "./theme"

const root = createRoot(document.getElementById("root"))

root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
)
