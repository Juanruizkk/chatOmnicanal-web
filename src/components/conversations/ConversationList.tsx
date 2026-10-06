import { useState } from "react"
import { useConversations } from "../../hooks/useConversations"
import { ConversationItem } from "./ConversationItem"
import { ConversationFilters } from "./ConversationFilters"
import type { ConversationsFilters } from "../../types/api.types"
import { Inbox } from "lucide-react"

export function ConversationList() {
  const [filters, setFilters] = useState<ConversationsFilters>({})
  const { data: conversations, isLoading } = useConversations(filters)

  return (
    <div className="flex h-full w-80 lg:w-96 shrink-0 flex-col border-r bg-background">
      <div className="flex items-center justify-between p-3.5 border-b">
        <div className="flex items-center gap-2">
          <Inbox className="h-4 w-4 text-primary" />
          <h1 className="font-semibold text-sm">Bandeja de Entrada</h1>
        </div>
        {conversations && (
          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
            {conversations.length}
          </span>
        )}
      </div>

      <ConversationFilters filters={filters} onChange={setFilters} />

      <div className="flex-1 overflow-y-auto divide-y divide-border/40">
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-8 gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-xs text-muted-foreground">Cargando conversaciones...</p>
          </div>
        )}

        {!isLoading && (!conversations || conversations.length === 0) && (
          <div className="flex flex-col items-center justify-center p-8 text-center gap-2">
            <Inbox className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">
              No hay conversaciones
            </p>
            <p className="text-xs text-muted-foreground/70">
              Las conversaciones aparecerán aquí cuando los clientes envíen mensajes.
            </p>
          </div>
        )}

        {!isLoading &&
          conversations &&
          conversations.map((conv) => (
            <ConversationItem key={conv.id} conversation={conv} />
          ))}
      </div>
    </div>
  )
}
