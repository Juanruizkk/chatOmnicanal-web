import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { useAuth } from "@clerk/clerk-react"
import { Sidebar } from "./Sidebar"
import { setAuthTokenGetter } from "../../lib/apiClient"
import { useSignalR } from "../../hooks/useSignalR"

export function AppLayout() {
  const { getToken } = useAuth()

  useEffect(() => {
    setAuthTokenGetter(() => getToken())
  }, [getToken])

  // Initialize persistent SignalR connection
  useSignalR()

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <main className="flex flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
