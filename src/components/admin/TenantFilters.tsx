// src/components/admin/TenantFilters.tsx
import { useAdminStore } from "../../store/adminStore"

export function TenantFilters() {
  const { tenantsFilters, setTenantsFilters } = useAdminStore()

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <input
        type="search"
        placeholder="Buscar por nombre..."
        value={tenantsFilters.search ?? ""}
        onChange={(e) => setTenantsFilters({ search: e.target.value })}
        className="border border-border rounded-md px-3 py-1.5 text-sm bg-background min-w-[200px]"
      />
      <select
        value={tenantsFilters.status ?? ""}
        onChange={(e) =>
          setTenantsFilters({ status: e.target.value || undefined })
        }
        className="border border-border rounded-md px-3 py-1.5 text-sm bg-background"
      >
        <option value="">Todos los estados</option>
        <option value="Active">Activo</option>
        <option value="Suspended">Suspendido</option>
        <option value="Cancelled">Cancelado</option>
      </select>
      <select
        value={tenantsFilters.plan ?? ""}
        onChange={(e) =>
          setTenantsFilters({ plan: e.target.value || undefined })
        }
        className="border border-border rounded-md px-3 py-1.5 text-sm bg-background"
      >
        <option value="">Todos los planes</option>
        <option value="Basic">Basic</option>
        <option value="Pro">Pro</option>
        <option value="Enterprise">Enterprise</option>
      </select>
    </div>
  )
}
