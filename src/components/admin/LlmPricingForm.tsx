// src/components/admin/LlmPricingForm.tsx
import { useState } from "react"
import type { LlmPricingDto } from "../../types/api.types"

interface Props {
  initial?: LlmPricingDto
  onSubmit: (data: LlmPricingDto) => void
  onCancel: () => void
  isLoading: boolean
}

const EMPTY: LlmPricingDto = {
  id: "00000000-0000-0000-0000-000000000000",
  modelId: "",
  displayName: "",
  inputPricePerMillionTokens: 0,
  outputPricePerMillionTokens: 0,
  isActive: true,
  updatedAt: new Date().toISOString(),
}

export function LlmPricingForm({ initial = EMPTY, onSubmit, onCancel, isLoading }: Props) {
  const [form, setForm] = useState(initial)

  const inputCls = "border border-border rounded-md px-3 py-1.5 bg-background text-sm w-full"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Model ID</label>
        <input
          type="text"
          required
          placeholder="llama-3.3-70b-versatile"
          value={form.modelId}
          onChange={(e) => setForm({ ...form, modelId: e.target.value })}
          className={inputCls}
        />
      </div>
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Nombre para mostrar</label>
        <input
          type="text"
          required
          placeholder="Llama 3.3 70B"
          value={form.displayName}
          onChange={(e) => setForm({ ...form, displayName: e.target.value })}
          className={inputCls}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Precio entrada ($/M tokens)</label>
          <input
            type="number"
            step="0.000001"
            required
            value={form.inputPricePerMillionTokens}
            onChange={(e) =>
              setForm({ ...form, inputPricePerMillionTokens: parseFloat(e.target.value) })
            }
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Precio salida ($/M tokens)</label>
          <input
            type="number"
            step="0.000001"
            required
            value={form.outputPricePerMillionTokens}
            onChange={(e) =>
              setForm({ ...form, outputPricePerMillionTokens: parseFloat(e.target.value) })
            }
            className={inputCls}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={form.isActive}
          onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          className="h-4 w-4"
        />
        <label htmlFor="isActive" className="text-sm">
          Activo
        </label>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
        >
          {isLoading ? "Guardando..." : "Guardar"}
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
