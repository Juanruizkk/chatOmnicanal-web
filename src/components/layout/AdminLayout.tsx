// src/components/layout/AdminLayout.tsx
import { Navigate, NavLink, Outlet } from "react-router-dom"
import { useUser } from "@clerk/clerk-react"

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  if (!isLoaded) return null
  const role = user?.publicMetadata?.role as string | undefined
  if (role !== "superadmin") return <Navigate to="/conversations" replace />
  return <>{children}</>
}

export function AdminLayout() {
  return (
    <AdminGuard>
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        <aside className="w-56 shrink-0 border-r border-border flex flex-col bg-card">
          <div className="px-4 py-5 border-b border-border">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Superadmin
            </span>
          </div>
          <nav className="flex flex-col gap-1 p-3 flex-1">
            <AdminNavLink to="/admin" end>
              Tenants
            </AdminNavLink>
            <AdminNavLink to="/admin/settings">Precios LLM</AdminNavLink>
            <AdminNavLink to="/admin/audit-log">Audit Log</AdminNavLink>
          </nav>
          <div className="p-3 border-t border-border">
            <NavLink
              to="/conversations"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent transition-colors"
            >
              ← Volver al panel
            </NavLink>
          </div>
        </aside>
        <main className="flex flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </AdminGuard>
  )
}

function AdminNavLink({
  to,
  end,
  children,
}: {
  to: string
  end?: boolean
  children: React.ReactNode
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
          isActive
            ? "bg-primary text-primary-foreground font-medium"
            : "text-foreground hover:bg-accent"
        }`
      }
    >
      {children}
    </NavLink>
  )
}
