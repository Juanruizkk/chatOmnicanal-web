import { useState } from "react"
import { Outlet, useMatch } from "react-router-dom"
import { ConversationList } from "../components/conversations/ConversationList"
import { useOnboardingProgress } from "../hooks/useOnboardingProgress"
import { MessageSquare, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "../components/ui/button"
import { GettingStartedModal } from "../components/onboarding/GettingStartedModal"

export function ConversationsPage() {
  const hasChat = useMatch("/conversations/:id")
  const [modalOpen, setModalOpen] = useState(false)
  const { completedCount, totalCount, isAllCompleted, percent } = useOnboardingProgress()

  return (
    <div className="flex h-full w-full overflow-hidden">
      <ConversationList />
      {!hasChat && (
        <div className="flex flex-1 flex-col items-center justify-center p-6 bg-muted/5 text-center">
          <div className="flex flex-col items-center max-w-sm gap-3">
            <div className="h-14 w-14 rounded-2xl bg-muted/60 border flex items-center justify-center text-muted-foreground/60 shadow-sm">
              <MessageSquare className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-foreground">
                Bandeja de entrada
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Seleccioná una conversación del panel izquierdo para ver el historial y responder en tiempo real.
              </p>
            </div>

            {/* Banner compacto de onboarding si aún no está 100% */}
            {!isAllCompleted && (
              <div className="mt-4 w-full rounded-xl border bg-card p-3 shadow-sm text-left flex items-center justify-between gap-3 animate-in fade-in duration-300">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">Primeros pasos</p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {completedCount} de {totalCount} completados ({percent}%)
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setModalOpen(true)}
                  className="h-7 text-xs px-2.5 gap-1 font-medium shrink-0 text-primary border-primary/20 hover:bg-primary/5"
                >
                  <span>Ver guía</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          <GettingStartedModal open={modalOpen} onOpenChange={setModalOpen} />
        </div>
      )}
      <Outlet />
    </div>
  )
}
