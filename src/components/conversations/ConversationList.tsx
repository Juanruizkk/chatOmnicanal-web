import { useState } from "react"
import { useConversations } from "../../hooks/useConversations"
import { ConversationItem } from "./ConversationItem"
import { ConversationFilters } from "./ConversationFilters"
import type { ConversationsFilters } from "../../types/api.types"

export function ConversationList() {
  const [filters, setFilters] = useState<ConversationsFilters>({})
  const { data, isLoading } = useConversations(filters)

  return (
    <div className="flex h-full w-80 shrink-0 flex-col border-r">
      <div className="p-3 border-b">
        <h1 className="font-semibold text-sm">Conversaciones</h1>
      </div>
      <ConversationFilters filters={filters} onChange={setFilters} />
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex justify-center p-6">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
        {!isLoading && data?.items.length === 0 && (
          <p className="p-6 text-center text-sm text-muted-foreground">
            No hay conversaciones
          </p>
        )}
        {data?.items.map(conv => (
          <ConversationItem key={conv.id} conversation={conv} />
        ))}
      </div>
    </div>
  )
}
