// src/pages/AdminSettingsPage.tsx
import { useState } from "react"
import {
  useLlmPricings,
  useUpsertLlmPricing,
  useDeleteLlmPricing,
} from "../hooks/useAdmin"
import { LlmPricingForm } from "../components/admin/LlmPricingForm"
import type { LlmPricingDto } from "../types/api.types"

export function AdminSettingsPage() {
  const { data: pricings, isLoading } = useLlmPricings()
  const upsert = useUpsertLlmPricing()
  const remove = useDeleteLlmPricing()
  const [editing, setEditing] = useState<LlmPricingDto | null>(null)
  const [showNew, setShowNew] = useState(false)

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Configuracion</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Precios de modelos LLM</p>
        </div>
        {!showNew && !editing && (
          <button
            onClick={() => setShowNew(true)}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium"
          >
            + Nuevo modelo
          </button>
        )}
      </div>

      {(showNew || editing) && (
        <div className="mb-6 p-4 rounded-lg border border-border bg-card">
          <h2 className="text-sm font-semibold mb-4">
            {editing ? "Editar modelo" : "Nuevo modelo"}
          </h2>
          <LlmPricingForm
            initial={editing ?? undefined}
            onSubmit={(data) =>
              upsert.mutate(data, {
                onSuccess: () => {
                  setShowNew(false)
                  setEditing(null)
                },
              })
            }
            onCancel={() => {
              setShowNew(false)
              setEditing(null)
            }}
            isLoading={upsert.isPending}
          />
        </div>
      )}

      {isLoading ? (
        <div className="text-muted-foreground text-sm py-8 text-center">Cargando...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <Th>Model ID</Th>
                <Th>Nombre</Th>
                <Th>Entrada ($/M)</Th>
                <Th>Salida ($/M)</Th>
                <Th>Activo</Th>
                <Th>Actualizado</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {(pricings ?? []).map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-2.5 font-mono text-xs">{p.modelId}</td>
                  <td className="px-4 py-2.5 font-medium">{p.displayName}</td>
                  <td className="px-4 py-2.5">${p.inputPricePerMillionTokens.toFixed(6)}</td>
                  <td className="px-4 py-2.5">${p.outputPricePerMillionTokens.toFixed(6)}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`text-xs font-semibold ${
                        p.isActive ? "text-green-600" : "text-muted-foreground"
                      }`}
                    >
                      {p.isActive ? "Si" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs">
                    {new Date(p.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2.5 flex gap-3">
                    <button
                      onClick={() => setEditing(p)}
                      className="text-sm text-primary hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => remove.mutate(p.id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
