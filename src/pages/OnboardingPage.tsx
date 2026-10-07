import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { UserButton } from "@clerk/clerk-react"
import { MessageSquare } from "lucide-react"
import { createTenant } from "../services/account"
import { useMe } from "../hooks/useMe"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"

export function OnboardingPage() {
  const [name, setName] = useState("")
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: me, isLoading } = useMe()

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (n: string) => createTenant(n),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] })
      navigate("/conversations", { replace: true })
    },
  })

  if (isLoading) return null
  if (me?.tenant) return <Navigate to="/conversations" replace />

  const submit = () => {
    const trimmed = name.trim()
    if (trimmed) mutate(trimmed)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="absolute right-4 top-4">
        <UserButton />
      </div>
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <MessageSquare className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold">Creá tu negocio</h1>
          <p className="text-sm text-muted-foreground">
            Vas a quedar como dueño y después podés invitar a tu equipo desde Configuración → Agentes.
          </p>
          <p className="text-xs text-muted-foreground">
            Si te invitaron a un negocio existente, ingresá con el mismo email al que llegó la invitación.
          </p>
        </div>

        <div className="space-y-1">
          <Label htmlFor="tenant-name">Nombre del negocio</Label>
          <Input
            id="tenant-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Mi tienda"
            autoFocus
          />
        </div>

        {isError && (
          <p className="text-sm text-destructive">No se pudo crear el negocio. Intentá de nuevo.</p>
        )}

        <Button className="w-full" onClick={submit} disabled={!name.trim() || isPending}>
          {isPending ? "Creando…" : "Continuar"}
        </Button>
      </div>
    </div>
  )
}
