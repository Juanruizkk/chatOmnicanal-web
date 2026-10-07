import { Outlet } from "react-router-dom"

export function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Outlet />
    </div>
  )
}
