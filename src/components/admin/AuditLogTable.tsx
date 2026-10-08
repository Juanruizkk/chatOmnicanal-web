// src/components/admin/AuditLogTable.tsx
import type { AuditLogEntryDto } from "../../types/api.types"

interface Props {
  entries: AuditLogEntryDto[]
}

export function AuditLogTable({ entries }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <Th>Fecha</Th>
            <Th>Tenant</Th>
            <Th>Accion</Th>
            <Th>Admin</Th>
            <Th>Detalles</Th>
            <Th>IP</Th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id} className="border-t border-border hover:bg-accent/20 transition-colors">
              <td className="px-4 py-2.5 text-muted-foreground text-xs whitespace-nowrap">
                {new Date(e.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-2.5 font-medium">{e.tenantName ?? "—"}</td>
              <td className="px-4 py-2.5">
                <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                  {e.action}
                </span>
              </td>
              <td className="px-4 py-2.5 text-muted-foreground text-xs truncate max-w-[120px]">
                {e.adminUserId}
              </td>
              <td className="px-4 py-2.5 text-muted-foreground text-xs">
                {e.details ?? "—"}
              </td>
              <td className="px-4 py-2.5 text-muted-foreground text-xs">
                {e.ipAddress ?? "—"}
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
