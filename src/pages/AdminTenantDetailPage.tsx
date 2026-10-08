// src/pages/AdminTenantDetailPage.tsx
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  useAdminTenant,
  useAdminTenantStats,
  useUpdateTenantConfig,
  useAdminBillingInfo,
  useUpsertBillingInfo,
  useAdminPayments,
  useRegisterPayment,
  useDeletePayment,
} from "../hooks/useAdmin"
import { PaymentForm } from "../components/admin/PaymentForm"
import { BillingInfoForm } from "../components/admin/BillingInfoForm"
import type { UpdateTenantConfigRequest } from "../types/api.types"

type Tab = "profile" | "stats" | "config" | "payments"

export function AdminTenantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>("profile")
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  const tenantId = id!
  const { data: tenant, isLoading } = useAdminTenant(tenantId)
  const { data: stats } = useAdminTenantStats(tenantId)
  const { data: billing } = useAdminBillingInfo(tenantId)
  const { data: payments } = useAdminPayments(tenantId)

  const updateConfig = useUpdateTenantConfig(tenantId)
  const upsertBilling = useUpsertBillingInfo(tenantId)
  const registerPayment = useRegisterPayment(tenantId)
  const deletePayment = useDeletePayment(tenantId)

  const inputCls = "border border-border rounded-md px-3 py-1.5 bg-background text-sm w-full"

  if (isLoading) return <div className="p-6 text-muted-foreground">Cargando...</div>
  if (!tenant) return <div className="p-6 text-muted-foreground">Tenant no encontrado.</div>

  const handleUpdateConfig = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const req: UpdateTenantConfigRequest = {
      plan: fd.get("plan") as string,
      status: fd.get("status") as string,
      conversationQuota: fd.get("conversationQuota")
        ? Number(fd.get("conversationQuota"))
        : null,
      internalNotes: (fd.get("internalNotes") as string) || null,
    }
    updateConfig.mutate(req)
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <button
        onClick={() => navigate("/admin")}
        className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"
      >
        ← Volver a tenants
      </button>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{tenant.name}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {tenant.plan} · {tenant.status} · creado{" "}
            {new Date(tenant.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-6 gap-1">
        {(
          [
            ["profile", "Perfil"],
            ["stats", "Estadísticas"],
            ["config", "Configuración"],
            ["payments", "Pagos"],
          ] as [Tab, string][]
        ).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Perfil */}
      {activeTab === "profile" && billing && (
        <div>
          <h2 className="text-base font-semibold mb-4">Información de facturación</h2>
          <BillingInfoForm
            initial={billing}
            onSubmit={(data) => upsertBilling.mutate(data)}
            isLoading={upsertBilling.isPending}
          />
        </div>
      )}

      {/* Tab: Estadísticas */}
      {activeTab === "stats" && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Conversaciones (30d)" value={stats.conversationsLast30Days} />
          <StatCard label="Conversaciones (total)" value={stats.conversationsAllTime} />
          <StatCard label="Mensajes (30d)" value={stats.messagesLast30Days} />
          <StatCard label="Mensajes (total)" value={stats.messagesAllTime} />
          <StatCard
            label="Tokens entrada (30d)"
            value={stats.inputTokensLast30Days.toLocaleString()}
          />
          <StatCard
            label="Tokens salida (30d)"
            value={stats.outputTokensLast30Days.toLocaleString()}
          />
          <StatCard
            label="Costo est. (30d)"
            value={`$${stats.estimatedCostUsdLast30Days.toFixed(4)}`}
          />
          <StatCard
            label="Costo est. (total)"
            value={`$${stats.estimatedCostUsdAllTime.toFixed(4)}`}
          />
        </div>
      )}

      {/* Tab: Configuración */}
      {activeTab === "config" && (
        <div className="max-w-lg">
          <h2 className="text-base font-semibold mb-4">Configuración del tenant</h2>
          <form onSubmit={handleUpdateConfig} className="space-y-4">
            <Field label="Plan">
              <select name="plan" defaultValue={tenant.plan} className={inputCls}>
                <option value="Basic">Basic</option>
                <option value="Pro">Pro</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </Field>
            <Field label="Estado">
              <select name="status" defaultValue={tenant.status} className={inputCls}>
                <option value="Active">Activo</option>
                <option value="Suspended">Suspendido</option>
                <option value="Cancelled">Cancelado</option>
              </select>
            </Field>
            <Field label="Cupo de conversaciones">
              <input
                type="number"
                name="conversationQuota"
                defaultValue={tenant.conversationQuota ?? ""}
                placeholder="Sin límite"
                className={inputCls}
              />
            </Field>
            <Field label="Notas internas">
              <textarea
                name="internalNotes"
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </Field>
            <button
              type="submit"
              disabled={updateConfig.isPending}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
            >
              {updateConfig.isPending ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </div>
      )}

      {/* Tab: Pagos */}
      {activeTab === "payments" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">Historial de pagos</h2>
            {!showPaymentForm && (
              <button
                onClick={() => setShowPaymentForm(true)}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium"
              >
                + Registrar pago
              </button>
            )}
          </div>

          {showPaymentForm && (
            <div className="mb-6 p-4 rounded-lg border border-border bg-card">
              <h3 className="text-sm font-semibold mb-4">Nuevo pago</h3>
              <PaymentForm
                onSubmit={(data) =>
                  registerPayment.mutate(data, {
                    onSuccess: () => setShowPaymentForm(false),
                  })
                }
                onCancel={() => setShowPaymentForm(false)}
                isLoading={registerPayment.isPending}
              />
            </div>
          )}

          {payments && payments.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <Th>Fecha</Th>
                    <Th>Monto</Th>
                    <Th>Estado</Th>
                    <Th>Periodo</Th>
                    <Th>Descripción</Th>
                    <Th>Ref.</Th>
                    <Th></Th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-t border-border">
                      <td className="px-4 py-2.5">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2.5 font-medium">
                        {p.amount.toFixed(2)} {p.currency}
                      </td>
                      <td className="px-4 py-2.5">{p.status}</td>
                      <td className="px-4 py-2.5 text-muted-foreground text-xs">
                        {new Date(p.periodStart).toLocaleDateString()} —{" "}
                        {new Date(p.periodEnd).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {p.description ?? "—"}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {p.externalReference ?? "—"}
                      </td>
                      <td className="px-4 py-2.5">
                        <button
                          onClick={() => deletePayment.mutate(p.id)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Sin pagos registrados.</p>
          )}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-1">{label}</label>
      {children}
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
