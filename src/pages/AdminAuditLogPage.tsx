// src/pages/AdminAuditLogPage.tsx
import { useState } from "react"
import { useAdminAuditLog } from "../hooks/useAdmin"
import { AuditLogTable } from "../components/admin/AuditLogTable"

const ADMIN_ACTIONS = [
  "TenantStatusChanged",
  "TenantPlanChanged",
  "TenantQuotaUpdated",
  "TenantConfigUpdated",
  "TenantBillingInfoUpdated",
  "PaymentRegistered",
  "PaymentDeleted",
  "LlmPricingUpdated",
  "LlmPricingDeleted",
]

export function AdminAuditLogPage() {
  const [action, setAction] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [page, setPage] = useState(1)

  const { data, isLoading } = useAdminAuditLog({
    action: action || undefined,
    from: from || undefined,
    to: to || undefined,
    page,
    pageSize: 50,
  })

  return (
    <div className="flex-1 overflow-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Audit Log</h1>

      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={action}
          onChange={(e) => { setAction(e.target.value); setPage(1) }}
          className="border border-border rounded-md px-3 py-1.5 text-sm bg-background"
        >
          <option value="">Todas las acciones</option>
          {ADMIN_ACTIONS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={from}
          onChange={(e) => { setFrom(e.target.value); setPage(1) }}
          className="border border-border rounded-md px-3 py-1.5 text-sm bg-background"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => { setTo(e.target.value); setPage(1) }}
          className="border border-border rounded-md px-3 py-1.5 text-sm bg-background"
        />
      </div>

      {isLoading ? (
        <div className="text-muted-foreground text-sm py-8 text-center">Cargando...</div>
      ) : data && data.items.length > 0 ? (
        <>
          <AuditLogTable entries={data.items} />
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>{data.totalCount} entradas totales</span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 rounded border border-border disabled:opacity-40 hover:bg-accent transition-colors"
              >
                Anterior
              </button>
              <span className="px-3 py-1">
                {page} / {data.totalPages}
              </span>
              <button
                disabled={!data.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded border border-border disabled:opacity-40 hover:bg-accent transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-muted-foreground text-sm py-8 text-center">
          Sin entradas que coincidan con los filtros.
        </div>
      )}
    </div>
  )
}
