import AppRoutes from "./routes/AppRoutes"
import { Toaster } from "react-hot-toast"

function App() {
  return (
    <>
      <AppRoutes />

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000
        }}
      />
    </>
  )
}

export default App