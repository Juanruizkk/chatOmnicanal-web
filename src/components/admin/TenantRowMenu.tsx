// src/components/admin/TenantRowMenu.tsx
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useUpdateTenantConfig } from "../../hooks/useAdmin"
import type { TenantAdminDto } from "../../types/api.types"

interface Props {
  tenant: TenantAdminDto
}

export function TenantRowMenu({ tenant }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const updateConfig = useUpdateTenantConfig(tenant.id)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleStatus = () => {
    const newStatus = tenant.status === "Active" ? "Suspended" : "Active"
    updateConfig.mutate(
      {
        plan: tenant.plan,
        status: newStatus,
        conversationQuota: tenant.conversationQuota,
        internalNotes: null,
      },
      { onSuccess: () => setOpen(false) }
    )
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded hover:bg-accent transition-colors text-muted-foreground"
        aria-label="Acciones"
      >
        ⋯
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-10 w-44 rounded-lg border border-border bg-card shadow-lg py-1">
          <MenuItem onClick={() => navigate(`/admin/tenants/${tenant.id}`)}>
            Ver detalle
          </MenuItem>
          <MenuItem onClick={toggleStatus}>
            {tenant.status === "Active" ? "Suspender" : "Activar"}
          </MenuItem>
        </div>
      )}
    </div>
  )
}

function MenuItem({
  onClick,
  children,
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors"
    >
      {children}
    </button>
  )
}
