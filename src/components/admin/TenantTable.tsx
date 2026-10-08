// src/components/admin/TenantTable.tsx
import { useNavigate } from "react-router-dom"
import type { TenantAdminDto } from "../../types/api.types"
import { TenantRowMenu } from "./TenantRowMenu"

interface Props {
  tenants: TenantAdminDto[]
}

export function TenantTable({ tenants }: Props) {
  const navigate = useNavigate()

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <Th>Nombre</Th>
            <Th>Plan</Th>
            <Th>Estado</Th>
            <Th>Canales</Th>
            <Th>Convs (30d)</Th>
            <Th>Tokens (30d)</Th>
            <Th>Costo est.</Th>
            <Th>Pagado</Th>
            <Th>Alertas</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((t) => (
            <tr
              key={t.id}
              className="border-t border-border hover:bg-accent/30 cursor-pointer transition-colors"
              onClick={() => navigate(`/admin/tenants/${t.id}`)}
            >
              <td className="px-4 py-2.5 font-medium">{t.name}</td>
              <td className="px-4 py-2.5 text-muted-foreground">{t.plan}</td>
              <td className="px-4 py-2.5">
                <StatusBadge status={t.status} />
              </td>
              <td className="px-4 py-2.5 text-center">{t.activeChannels}</td>
              <td className="px-4 py-2.5 text-center">
                {t.conversationsLast30Days}
                {t.isNearQuota && (
                  <span className="ml-1 text-yellow-500 text-xs" title="Cerca del cupo">
                    ⚠
                  </span>
                )}
              </td>
              <td className="px-4 py-2.5 text-right">
                {t.tokensLast30Days.toLocaleString()}
              </td>
              <td className="px-4 py-2.5 text-right">
                ${t.estimatedCostUsd.toFixed(4)}
              </td>
              <td className="px-4 py-2.5 text-right">${t.totalPaidUsd.toFixed(2)}</td>
              <td className="px-4 py-2.5 text-center">
                {t.hasOverduePayment && (
                  <span className="text-red-500 text-xs font-semibold" title="Pago vencido">
                    ●
                  </span>
                )}
              </td>
              <td
                className="px-4 py-2.5"
                onClick={(e) => e.stopPropagation()}
              >
                <TenantRowMenu tenant={t} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
      {children}
    </th>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Suspended: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  }
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {status}
    </span>
  )
}
