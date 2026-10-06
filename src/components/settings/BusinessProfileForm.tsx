import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTenantProfile, useUpdateTenantProfile } from "../../hooks/useTenantProfile"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import type { TenantProfile } from "../../types/api.types"

type FormValues = Pick<TenantProfile,
  "address" | "timezone" | "contactPhone" | "contactEmail" | "tone" | "shippingInfo" | "paymentMethods"
>

export function BusinessProfileForm() {
  const { data: profile, isLoading } = useTenantProfile()
  const { mutate, isPending } = useUpdateTenantProfile()
  const { register, handleSubmit, reset } = useForm<FormValues>()

  useEffect(() => {
    if (profile) reset(profile)
  }, [profile, reset])

  if (isLoading) return <div className="p-6 text-sm text-muted-foreground">Cargando…</div>

  const onSubmit = (data: FormValues) => mutate(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div className="space-y-1">
        <Label>Dirección</Label>
        <Input {...register("address")} placeholder="Av. Corrientes 1234, CABA" />
      </div>
      <div className="space-y-1">
        <Label>Zona horaria</Label>
        <Input {...register("timezone")} placeholder="America/Argentina/Buenos_Aires" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Teléfono de contacto</Label>
          <Input {...register("contactPhone")} placeholder="+5491112345678" />
        </div>
        <div className="space-y-1">
          <Label>Email de contacto</Label>
          <Input {...register("contactEmail")} type="email" placeholder="hola@tienda.com" />
        </div>
      </div>
      <div className="space-y-1">
        <Label>Tono del bot</Label>
        <Input {...register("tone")} placeholder="amigable, formal, casual…" />
      </div>
      <div className="space-y-1">
        <Label>Información de envíos</Label>
        <Textarea {...register("shippingInfo")} rows={3} placeholder="Envíos a todo el país por Andreani..." />
      </div>
      <div className="space-y-1">
        <Label>Medios de pago</Label>
        <Textarea {...register("paymentMethods")} rows={2} placeholder="Efectivo, transferencia, MercadoPago..." />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  )
}
