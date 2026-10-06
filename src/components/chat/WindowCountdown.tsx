import { useWindowCountdown } from "../../hooks/useWindowCountdown"
import { Clock } from "lucide-react"

export function WindowCountdown({ lastUserMessageAt }: { lastUserMessageAt: string | null }) {
  const countdown = useWindowCountdown(lastUserMessageAt)

  if (!countdown) return null

  if (countdown.expired) {
    return (
      <div className="flex items-center gap-1 text-xs text-destructive">
        <Clock className="h-3 w-3" />
        Ventana de 24h vencida — solo templates
      </div>
    )
  }

  const isWarning = countdown.hours < 4

  return (
    <div className={`flex items-center gap-1 text-xs ${isWarning ? "text-orange-600" : "text-muted-foreground"}`}>
      <Clock className="h-3 w-3" />
      Ventana: {countdown.hours}h {countdown.minutes}m restantes
    </div>
  )
}
