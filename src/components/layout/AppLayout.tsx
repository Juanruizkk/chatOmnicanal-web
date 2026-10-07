import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { useSignalR } from "../../hooks/useSignalR"

export function AppLayout() {
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
