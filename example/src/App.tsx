import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ThemeProvider } from "@mui/material"

import Home from "@pages/Home"
import NotFound from "@pages/NotFound"
import theme from "@src/data/theme"
import WatermarkConfig from "@src/pages/WatermarkConfig"

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="config/:id" element={<WatermarkConfig />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export function WrappedApp() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  )
}
