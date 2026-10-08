// src/components/admin/PaymentForm.tsx
import { useState } from "react"
import type { RegisterPaymentRequest } from "../../types/api.types"

interface Props {
  onSubmit: (data: RegisterPaymentRequest) => void
  onCancel: () => void
  isLoading: boolean
}

export function PaymentForm({ onSubmit, onCancel, isLoading }: Props) {
  const today = new Date().toISOString().slice(0, 10)
  const monthAgo = new Date(Date.now() - 30 * 86400_000).toISOString().slice(0, 10)

  const [form, setForm] = useState<RegisterPaymentRequest>({
    amount: 0,
    currency: "USD",
    status: "Confirmed",
    description: null,
    externalReference: null,
    periodStart: monthAgo,
    periodEnd: today,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  const inputCls = "border border-border rounded-md px-3 py-1.5 bg-background text-sm w-full"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Monto">
          <input
            type="number"
            step="0.01"
            required
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
            className={inputCls}
          />
        </Field>
        <Field label="Moneda">
          <select
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            className={inputCls}
          >
            <option>USD</option>
            <option>ARS</option>
            <option>EUR</option>
          </select>
        </Field>
      </div>
      <Field label="Estado">
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className={inputCls}
        >
          <option value="Confirmed">Confirmado</option>
          <option value="Pending">Pendiente</option>
          <option value="Failed">Fallido</option>
          <option value="Refunded">Reembolsado</option>
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Periodo inicio">
          <input
            type="date"
            value={form.periodStart}
            onChange={(e) => setForm({ ...form, periodStart: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="Periodo fin">
          <input
            type="date"
            value={form.periodEnd}
            onChange={(e) => setForm({ ...form, periodEnd: e.target.value })}
            className={inputCls}
          />
        </Field>
      </div>
      <Field label="Descripción">
        <input
          type="text"
          value={form.description ?? ""}
          onChange={(e) => setForm({ ...form, description: e.target.value || null })}
          className={inputCls}
        />
      </Field>
      <Field label="Referencia externa">
        <input
          type="text"
          value={form.externalReference ?? ""}
          onChange={(e) =>
            setForm({ ...form, externalReference: e.target.value || null })
          }
          className={inputCls}
        />
      </Field>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
        >
          {isLoading ? "Guardando..." : "Registrar pago"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md border border-border text-sm"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-1">{label}</label>
      {children}
    </div>
  )
}
