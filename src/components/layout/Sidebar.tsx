import { useState } from "react"
import { NavLink } from "react-router-dom"
import {
  MessageSquare,
  Settings,
  Bot,
  FileText,
  Users,
  Sparkles,
  PanelLeft,
  ShieldCheck,
  UserCheck,
  Radio,
} from "lucide-react"
import { cn } from "../../lib/utils"
import { UserButton } from "@clerk/clerk-react"
import { useSignalRStore } from "../../store/signalRStore"
import { useOnboardingProgress } from "../../hooks/useOnboardingProgress"
import { useMe } from "../../hooks/useMe"
import { GettingStartedModal } from "../onboarding/GettingStartedModal"

const mainNav = [
  { to: "/conversations", icon: MessageSquare, label: "Conversaciones" },
  { to: "/simulation", icon: Bot, label: "Simulación" },
]

const settingsNav = [
  { to: "/settings/channels", icon: Radio, label: "Canales & Meta" },
  { to: "/settings/profile", icon: Settings, label: "Perfil de negocio" },
  { to: "/settings/documents", icon: FileText, label: "Documentos RAG" },
  { to: "/settings/agents", icon: Users, label: "Agentes y equipo" },
]

export function Sidebar() {
  const { data: me } = useMe()
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebar_collapsed") === "true"
  })
  const [modalOpen, setModalOpen] = useState(false)
  const signalRStatus = useSignalRStore((s) => s.status)
  const { completedCount, totalCount, isAllCompleted, percent } = useOnboardingProgress()

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem("sidebar_collapsed", next ? "true" : "false")
      return next
    })
  }

  const tenantName = me?.tenant?.name || "Mi Negocio"
  const tenantInitial = tenantName.charAt(0).toUpperCase()
  const isOwner = me?.role === "Owner"
  const roleLabel = isOwner ? "Dueño" : me?.role === "Agent" ? "Agente" : "Miembro"
  const roleTooltip = isOwner
    ? "Rol: Dueño • Control total de administración, suscripción y equipo"
    : "Rol: Agente • Gestión de conversaciones y atención al cliente"

  const statusColor =
    signalRStatus === "connected"
      ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
      : signalRStatus === "connecting" || signalRStatus === "reconnecting"
      ? "bg-amber-500 animate-pulse"
      : "bg-rose-500"

  const statusTitle =
    signalRStatus === "connected"
      ? "En vivo (Conectado)"
      : signalRStatus === "connecting" || signalRStatus === "reconnecting"
      ? "Reconectando..."
      : "Desconectado"

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-background transition-all duration-300 select-none",
        collapsed ? "w-16 items-center py-3 px-2" : "w-60 p-3"
      )}
    >
      {/* Header: Tenant Info + Collapse Toggle Button */}
      <div className={cn("mb-4 w-full", collapsed && "flex flex-col items-center gap-2.5")}>
        {!collapsed ? (
          <div className="flex items-center justify-between gap-2 px-1">
            {/* Tenant details */}
            <div
              className="flex items-center gap-2.5 min-w-0"
              title={`${tenantName} • ${roleTooltip}`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-sm">
                {tenantInitial}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-sm text-foreground truncate">
                  {tenantName}
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span
                    title={roleTooltip}
                    className={cn(
                      "inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded cursor-help",
                      isOwner
                        ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                        : "bg-blue-500/15 text-blue-700 dark:text-blue-400"
                    )}
                  >
                    {isOwner ? (
                      <ShieldCheck className="h-2.5 w-2.5" />
                    ) : (
                      <UserCheck className="h-2.5 w-2.5" />
                    )}
                    {roleLabel}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate">
                    • {me?.tenant?.plan || "Free"}
                  </span>
                </div>
              </div>
            </div>

            {/* Toggle collapse button */}
            <button
              type="button"
              onClick={toggleCollapsed}
              title="Colapsar barra lateral"
              className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2.5 w-full">
            {/* Toggle expand button */}
            <button
              type="button"
              onClick={toggleCollapsed}
              title="Expandir barra lateral"
              className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <PanelLeft className="h-4 w-4" />
            </button>

            {/* Tenant avatar with role dot */}
            <div
              title={`${tenantName} • ${roleTooltip}`}
              className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-sm cursor-help"
            >
              {tenantInitial}
              <span
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",
                  isOwner ? "bg-amber-500" : "bg-blue-500"
                )}
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto w-full">
        {/* Main Section */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-1">
              Atención
            </p>
          )}
          {mainNav.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2.5 rounded-lg text-xs font-medium transition-colors",
                    collapsed
                      ? "h-10 w-10 justify-center text-muted-foreground hover:bg-muted hover:text-foreground mx-auto"
                      : "px-2.5 py-2 text-muted-foreground hover:bg-muted hover:text-foreground",
                    isActive &&
                      (collapsed
                        ? "bg-primary/10 text-primary"
                        : "bg-primary/10 text-primary font-semibold")
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            )
          })}
        </div>

        {/* Settings Section */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-1">
              Configuración
            </p>
          )}
          {settingsNav.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2.5 rounded-lg text-xs font-medium transition-colors",
                    collapsed
                      ? "h-10 w-10 justify-center text-muted-foreground hover:bg-muted hover:text-foreground mx-auto"
                      : "px-2.5 py-2 text-muted-foreground hover:bg-muted hover:text-foreground",
                    isActive &&
                      (collapsed
                        ? "bg-primary/10 text-primary"
                        : "bg-primary/10 text-primary font-semibold")
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            )
          })}
        </div>
      </nav>

      {/* Getting Started Guide Trigger Banner */}
      <div className={cn("my-2 w-full", collapsed && "flex justify-center")}>
        {!collapsed ? (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="w-full flex flex-col gap-1.5 rounded-xl border border-border/60 bg-muted/30 p-2.5 text-left hover:bg-muted/70 transition-all text-xs group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <Sparkles
                  className={cn(
                    "h-3.5 w-3.5",
                    isAllCompleted ? "text-emerald-500" : "text-amber-500"
                  )}
                />
                <span>Guía de inicio</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">
                {percent}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  isAllCompleted ? "bg-emerald-500" : "bg-primary"
                )}
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground truncate">
              {isAllCompleted ? "100% Configurado" : `${completedCount} de ${totalCount} completados`}
            </p>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            title={`Guía de inicio: ${completedCount}/${totalCount} (${percent}%)`}
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-muted",
              isAllCompleted
                ? "text-emerald-600 hover:text-emerald-700"
                : "text-amber-500 hover:text-amber-600"
            )}
          >
            <Sparkles className="h-4 w-4" />
            {!isAllCompleted && (
              <span className="absolute 1 top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground shadow">
                {completedCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Footer Area: SignalR Status & User Profile */}
      <div className="mt-auto pt-2 border-t border-border/50 w-full space-y-2">
        {/* SignalR Connection State */}
        <div
          className={cn(
            "flex items-center rounded-lg p-1.5 text-xs text-muted-foreground",
            collapsed ? "justify-center" : "gap-2"
          )}
          title={statusTitle}
        >
          <div className={cn("h-2 w-2 rounded-full", statusColor)} />
          {!collapsed && <span className="text-[11px] truncate">{statusTitle}</span>}
        </div>

        {/* User Account / Profile */}
        <div
          className={cn(
            "flex items-center",
            collapsed ? "justify-center" : "gap-2 px-1"
          )}
        >
          <UserButton />
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-foreground truncate">
                {me?.user?.name || "Usuario"}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                {me?.user?.email}
              </span>
            </div>
          )}
        </div>
      </div>

      <GettingStartedModal open={modalOpen} onOpenChange={setModalOpen} />
    </aside>
  )
}
