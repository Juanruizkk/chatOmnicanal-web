// src/components/admin/BillingInfoForm.tsx
import { useState } from "react"
import type { BillingInfoDto } from "../../types/api.types"

interface Props {
  initial: BillingInfoDto
  onSubmit: (data: BillingInfoDto) => void
  isLoading: boolean
}

export function BillingInfoForm({ initial, onSubmit, isLoading }: Props) {
  const [form, setForm] = useState(initial)

  const inputCls = "border border-border rounded-md px-3 py-1.5 bg-background text-sm w-full"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      {(
        [
          ["companyName", "Razón social"],
          ["taxId", "CUIT / Tax ID"],
          ["billingEmail", "Email de facturación"],
          ["address", "Dirección"],
          ["country", "País"],
        ] as [keyof BillingInfoDto, string][]
      ).map(([field, label]) => (
        <div key={field}>
          <label className="block text-xs text-muted-foreground mb-1">{label}</label>
          <input
            type="text"
            value={(form[field] as string) ?? ""}
            onChange={(e) => setForm({ ...form, [field]: e.target.value || null })}
            className={inputCls}
          />
        </div>
      ))}
      <div>
        <label className="block text-xs text-muted-foreground mb-1">
          Notas internas
        </label>
        <textarea
          rows={3}
          value={form.notes ?? ""}
          onChange={(e) => setForm({ ...form, notes: e.target.value || null })}
          className={`${inputCls} resize-none`}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
      >
        {isLoading ? "Guardando..." : "Guardar"}
      </button>
    </form>
  )
}
