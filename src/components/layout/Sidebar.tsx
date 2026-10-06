import { NavLink } from "react-router-dom"
import { MessageSquare, Settings, Bot, FileText, Users } from "lucide-react"
import { cn } from "../../lib/utils"
import { UserButton } from "@clerk/clerk-react"

const mainNav = [
  { to: "/conversations", icon: MessageSquare, label: "Conversaciones" },
  { to: "/simulation", icon: Bot, label: "Simulación" },
]

const settingsNav = [
  { to: "/settings/profile", icon: Settings, label: "Perfil" },
  { to: "/settings/documents", icon: FileText, label: "Documentos" },
  { to: "/settings/agents", icon: Users, label: "Agentes" },
]

function NavItem({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) {
  return (
    <NavLink
      to={to}
      title={label}
      className={({ isActive }) =>
        cn(
          "flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          isActive && "bg-muted text-foreground"
        )
      }
    >
      <Icon className="h-5 w-5" />
    </NavLink>
  )
}

export function Sidebar() {
  return (
    <aside className="flex h-screen w-14 flex-col items-center border-r bg-background py-4 gap-1">
      <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
        <MessageSquare className="h-4 w-4 text-primary-foreground" />
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {mainNav.map(item => <NavItem key={item.to} {...item} />)}
        <div className="my-2 h-px w-8 bg-border" />
        {settingsNav.map(item => <NavItem key={item.to} {...item} />)}
      </nav>
      <UserButton afterSignOutUrl="/sign-in" />
    </aside>
  )
}
