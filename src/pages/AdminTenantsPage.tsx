// src/pages/AdminTenantsPage.tsx
import { adminApi } from "../services/admin"
import { useAdminKpi, useAdminTenants } from "../hooks/useAdmin"
import { useAdminStore } from "../store/adminStore"
import { KpiStrip } from "../components/admin/KpiStrip"
import { TenantFilters } from "../components/admin/TenantFilters"
import { TenantTable } from "../components/admin/TenantTable"

export function AdminTenantsPage() {
  const { tenantsFilters, setTenantsFilters } = useAdminStore()
  const { data: tenantsPage, isLoading } = useAdminTenants(tenantsFilters)
  const { data: kpi } = useAdminKpi()

  const handleExport = async () => {
    const blob = await adminApi.exportCsv(tenantsFilters)
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `tenants_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Tenants</h1>
        <button
          onClick={handleExport}
          className="px-4 py-2 text-sm rounded-md border border-border hover:bg-accent transition-colors"
        >
          Exportar CSV
        </button>
      </div>

      {kpi && <KpiStrip kpi={kpi} />}

      <TenantFilters />

      {isLoading ? (
        <div className="text-muted-foreground text-sm py-8 text-center">Cargando...</div>
      ) : tenantsPage && tenantsPage.items.length > 0 ? (
        <>
          <TenantTable tenants={tenantsPage.items} />
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>
              {tenantsPage.totalCount} tenants totales
            </span>
            <div className="flex gap-2">
              <button
                disabled={tenantsFilters.page === 1}
                onClick={() =>
                  setTenantsFilters({ page: (tenantsFilters.page ?? 1) - 1 })
                }
                className="px-3 py-1 rounded border border-border disabled:opacity-40 hover:bg-accent transition-colors"
              >
                Anterior
              </button>
              <span className="px-3 py-1">
                {tenantsFilters.page ?? 1} / {tenantsPage.totalPages}
              </span>
              <button
                disabled={!tenantsPage.hasNextPage}
                onClick={() =>
                  setTenantsFilters({ page: (tenantsFilters.page ?? 1) + 1 })
                }
                className="px-3 py-1 rounded border border-border disabled:opacity-40 hover:bg-accent transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-muted-foreground text-sm py-8 text-center">
          No hay tenants que coincidan con los filtros.
        </div>
      )}
    </div>
  )
}
