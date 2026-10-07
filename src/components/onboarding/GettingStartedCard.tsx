import { useNavigate } from "react-router-dom"
import { useOnboardingProgress } from "../../hooks/useOnboardingProgress"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { ArrowRight, Sparkles, Check, X } from "lucide-react"
import { cn } from "../../lib/utils"

interface GettingStartedCardProps {
  onClose?: () => void
  showDismiss?: boolean
  className?: string
}

export function GettingStartedCard({
  onClose,
  showDismiss = true,
  className,
}: GettingStartedCardProps) {
  const navigate = useNavigate()
  const {
    steps,
    completedCount,
    totalCount,
    percent,
    isAllCompleted,
    setDismissed,
    tenantName,
  } = useOnboardingProgress()

  const handleDismiss = () => {
    setDismissed(true)
    if (onClose) onClose()
  }

  const handleAction = (route: string) => {
    if (onClose) onClose()
    navigate(route)
  }

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden",
        className
      )}
    >
      {/* Header with gradient tint */}
      <div className="relative border-b bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5 sm:p-6 pr-14">
        {showDismiss && !onClose && (
          <button
            type="button"
            onClick={handleDismiss}
            title="Ocultar guía de inicio"
            className="absolute right-4 top-4 z-30 rounded-full p-1.5 bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground border shadow-sm transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <div className="flex items-center gap-2.5 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <Badge
            variant={isAllCompleted ? "default" : "secondary"}
            className={cn(
              "font-semibold text-xs",
              isAllCompleted && "bg-emerald-600 text-white hover:bg-emerald-600"
            )}
          >
            {isAllCompleted
              ? "🎉 ¡Configuración 100% Completa!"
              : `${completedCount} de ${totalCount} completados (${percent}%)`}
          </Badge>
        </div>

        <h2 className="text-xl font-bold tracking-tight text-foreground">
          {isAllCompleted
            ? `¡${tenantName} ya está listo para operar!`
            : `Primeros pasos en ${tenantName}`}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed">
          {isAllCompleted
            ? "Tu bot de inteligencia artificial tiene todo lo necesario para comenzar a responder y derivar consultas de tus clientes."
            : "Seguí esta guía interactiva para configurar tu bot de IA, subir información clave y hacer tus primeras pruebas."}
        </p>

        {/* Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full transition-all duration-700 ease-out rounded-full",
                isAllCompleted ? "bg-emerald-500" : "bg-primary"
              )}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="divide-y divide-border/50 p-2 sm:p-4">
        {steps.map((step, idx) => {
          const Icon = step.icon
          return (
            <div
              key={step.id}
              className={cn(
                "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl transition-all duration-200",
                step.completed
                  ? "bg-muted/20 hover:bg-muted/30"
                  : "bg-background hover:bg-accent/40 border border-transparent hover:border-border"
              )}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {/* Status Indicator Icon */}
                <div className="mt-0.5 shrink-0">
                  {step.completed ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                    </div>
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-muted-foreground/30 text-[11px] font-bold text-muted-foreground">
                      {idx + 1}
                    </div>
                  )}
                </div>

                {/* Step Details */}
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-sm font-semibold truncate",
                        step.completed
                          ? "text-muted-foreground line-through decoration-muted-foreground/50"
                          : "text-foreground"
                      )}
                    >
                      {step.title}
                    </span>
                    {step.completed && (
                      <Badge
                        variant="outline"
                        className="text-[10px] py-0 px-1.5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"
                      >
                        Listo
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 self-end sm:self-center pl-9 sm:pl-0">
                <Button
                  size="sm"
                  variant={step.completed ? "outline" : "default"}
                  onClick={() => handleAction(step.route)}
                  className={cn(
                    "h-8 text-xs gap-1.5 transition-transform active:scale-95",
                    step.completed
                      ? "text-muted-foreground hover:text-foreground"
                      : "shadow-sm font-medium"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{step.actionLabel}</span>
                  {!step.completed && <ArrowRight className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer celebration or tips */}
      {isAllCompleted ? (
        <div className="border-t bg-emerald-500/10 p-4 text-center">
          <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
            ¡Excelente trabajo! Ya podés conectar tus canales de WhatsApp e Instagram o interactuar con clientes.
          </p>
        </div>
      ) : (
        <div className="border-t bg-muted/30 px-6 py-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>Consejo: Podés reabrir esta guía en cualquier momento desde la barra lateral.</span>
          {showDismiss && (
            <button
              onClick={handleDismiss}
              className="text-primary hover:underline font-medium text-xs ml-4"
            >
              Cerrar por ahora
            </button>
          )}
        </div>
      )}
    </div>
  )
}
