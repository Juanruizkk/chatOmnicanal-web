import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTenantProfile, useUpdateTenantProfile } from "../../hooks/useTenantProfile"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import type { TenantProfile } from "../../types/api.types"
import { Save, Check, Clock, Store, Shield } from "lucide-react"

interface DaySchedule {
  enabled: boolean
  open: string
  close: string
}

type WeekSchedule = Record<string, DaySchedule>

const DAYS: { key: string; label: string }[] = [
  { key: "monday", label: "Lunes" },
  { key: "tuesday", label: "Martes" },
  { key: "wednesday", label: "Miércoles" },
  { key: "thursday", label: "Jueves" },
  { key: "friday", label: "Viernes" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
]

const DEFAULT_SCHEDULE: WeekSchedule = {
  monday: { enabled: true, open: "09:00", close: "18:00" },
  tuesday: { enabled: true, open: "09:00", close: "18:00" },
  wednesday: { enabled: true, open: "09:00", close: "18:00" },
  thursday: { enabled: true, open: "09:00", close: "18:00" },
  friday: { enabled: true, open: "09:00", close: "18:00" },
  saturday: { enabled: true, open: "09:00", close: "13:00" },
  sunday: { enabled: false, open: "09:00", close: "18:00" },
}

export function BusinessProfileForm() {
  const { data: profile, isLoading } = useTenantProfile()
  const { mutate, isPending, isSuccess } = useUpdateTenantProfile()
  const { register, handleSubmit, reset } = useForm<TenantProfile>()
  const [schedule, setSchedule] = useState<WeekSchedule>(DEFAULT_SCHEDULE)

  useEffect(() => {
    if (profile) {
      reset(profile)
      if (profile.businessHoursJson) {
        try {
          const parsed = JSON.parse(profile.businessHoursJson)
          const newSched: WeekSchedule = { ...DEFAULT_SCHEDULE }
          for (const d of DAYS) {
            if (parsed[d.key]) {
              newSched[d.key] = {
                enabled: true,
                open: parsed[d.key].open || "09:00",
                close: parsed[d.key].close || "18:00",
              }
            } else {
              newSched[d.key] = {
                enabled: false,
                open: "09:00",
                close: "18:00",
              }
            }
          }
          setSchedule(newSched)
        } catch {
          // Keep default
        }
      }
    }
  }, [profile, reset])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  const handleDayToggle = (dayKey: string) => {
    setSchedule((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        enabled: !prev[dayKey].enabled,
      },
    }))
  }

  const handleTimeChange = (
    dayKey: string,
    field: "open" | "close",
    value: string
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [field]: value,
      },
    }))
  }

  const onSubmit = (data: TenantProfile) => {
    const serializedJson: Record<string, { open: string; close: string } | null> = {}
    for (const d of DAYS) {
      if (schedule[d.key].enabled) {
        serializedJson[d.key] = {
          open: schedule[d.key].open,
          close: schedule[d.key].close,
        }
      } else {
        serializedJson[d.key] = null
      }
    }

    mutate({
      ...data,
      businessHoursJson: JSON.stringify(serializedJson),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
      {/* Información General */}
      <div className="space-y-4 bg-background border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 pb-2 border-b">
          <Store className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-base">Información del Negocio</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-semibold">Dirección física o central</Label>
            <Input
              {...register("address")}
              placeholder="Av. Santa Fe 1234, CABA, Argentina"
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Zona Horaria (IANA)</Label>
            <Input
              {...register("timezone")}
              placeholder="America/Argentina/Buenos_Aires"
              className="text-sm font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Tono de respuesta del Bot</Label>
            <Input
              {...register("tone")}
              placeholder="Cálido, profesional y conciso"
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Teléfono de contacto</Label>
            <Input
              {...register("contactPhone")}
              placeholder="+54 9 11 5555-1234"
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Email de contacto</Label>
            <Input
              {...register("contactEmail")}
              type="email"
              placeholder="contacto@mitienda.com"
              className="text-sm"
            />
          </div>
        </div>
      </div>

      {/* Horarios de Atención Semanales */}
      <div className="space-y-4 bg-background border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-base">Horarios de Atención</h3>
          </div>
          <span className="text-xs text-muted-foreground">
            Fuera de horario, el bot derivará a cola de espera
          </span>
        </div>

        <div className="space-y-2.5">
          {DAYS.map((d) => {
            const item = schedule[d.key]
            return (
              <div
                key={d.key}
                className="flex items-center justify-between py-2 px-3 rounded-lg border bg-muted/20 text-sm gap-3"
              >
                <div className="flex items-center gap-3 w-32">
                  <input
                    type="checkbox"
                    id={`day-${d.key}`}
                    checked={item.enabled}
                    onChange={() => handleDayToggle(d.key)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <label
                    htmlFor={`day-${d.key}`}
                    className={`font-medium cursor-pointer ${
                      item.enabled ? "text-foreground" : "text-muted-foreground line-through"
                    }`}
                  >
                    {d.label}
                  </label>
                </div>

                {item.enabled ? (
                  <div className="flex items-center gap-2 text-xs">
                    <input
                      type="time"
                      value={item.open}
                      onChange={(e) => handleTimeChange(d.key, "open", e.target.value)}
                      className="px-2 py-1 rounded border border-input bg-background font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <span className="text-muted-foreground">a</span>
                    <input
                      type="time"
                      value={item.close}
                      onChange={(e) => handleTimeChange(d.key, "close", e.target.value)}
                      className="px-2 py-1 rounded border border-input bg-background font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic">Cerrado</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Envíos y Pagos */}
      <div className="space-y-4 bg-background border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 pb-2 border-b">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-base">Políticas y Preguntas Frecuentes</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Información de Envíos y Tiempos</Label>
            <Textarea
              {...register("shippingInfo")}
              rows={3}
              placeholder="Envíos a todo el país vía Andreani en 48-72 hs hábiles. Envío gratis en compras superiores a $50.000."
              className="text-sm resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Medios de Pago y Descuentos</Label>
            <Textarea
              {...register("paymentMethods")}
              rows={3}
              placeholder="Aceptamos transferencia bancaria (10% de descuento), Mercado Pago, tarjetas de débito y crédito hasta 3 cuotas sin interés."
              className="text-sm resize-none"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending} className="px-6 gap-2">
          {isPending ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Guardando...
            </>
          ) : isSuccess ? (
            <>
              <Check className="h-4 w-4" />
              Guardado exitoso
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar Configuración
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
