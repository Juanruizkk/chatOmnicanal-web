// src/components/admin/KpiStrip.tsx
import type { TenantKpiDto } from "../../types/api.types"

interface Props {
  kpi: TenantKpiDto
}

export function KpiStrip({ kpi }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
      <KpiCard label="Total tenants" value={kpi.totalTenants} />
      <KpiCard label="Activos" value={kpi.activeTenants} variant="success" />
      <KpiCard label="Suspendidos" value={kpi.suspendedTenants} variant="warning" />
      <KpiCard label="Con alertas" value={kpi.tenantsWithAlerts} variant="danger" />
      <KpiCard label="Tokens (30d)" value={kpi.totalTokensLast30Days.toLocaleString()} />
      <KpiCard
        label="Costo est. (30d)"
        value={`$${kpi.totalEstimatedCostUsd.toFixed(2)}`}
      />
      <KpiCard
        label="Cobrado total"
        value={`$${kpi.totalCollectedUsd.toFixed(2)}`}
        variant="success"
      />
    </div>
  )
}

function KpiCard({
  label,
  value,
  variant = "default",
}: {
  label: string
  value: string | number
  variant?: "default" | "success" | "warning" | "danger"
}) {
  const colorMap = {
    default: "text-foreground",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    danger: "text-red-600 dark:text-red-400",
  }
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <p className="text-xs text-muted-foreground truncate">{label}</p>
      <p className={`text-xl font-semibold mt-1 ${colorMap[variant]}`}>{value}</p>
    </div>
  )
}
