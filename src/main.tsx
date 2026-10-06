import React from "react"
import ReactDOM from "react-dom/client"
import { ClerkProvider } from "@clerk/clerk-react"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./lib/queryClient"
import App from "./App"
import "./index.css"

async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MOCKS !== "true") return
  const { worker } = await import("./mocks/browser")
  return worker.start({ onUnhandledRequest: "bypass" })
}

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ClerkProvider publishableKey={clerkKey}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ClerkProvider>
    </React.StrictMode>
  )
})
