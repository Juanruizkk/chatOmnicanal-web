import { useEffect, useRef } from "react"
import { useConversation } from "../../hooks/useConversations"
import { MessageBubble } from "./MessageBubble"
import { MessageInput } from "./MessageInput"
import { TakeControlButton } from "./TakeControlButton"
import { ResolveButton } from "./ResolveButton"
import { ReopenButton } from "./ReopenButton"
import { WindowCountdown } from "./WindowCountdown"
import { ChannelBadge } from "../conversations/ChannelBadge"
import { StatusBadge } from "../conversations/StatusBadge"
import { MessageSquare } from "lucide-react"

export function ChatView({ conversationId }: { conversationId: string }) {
  const { data: conversation, isLoading } = useConversation(conversationId)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation?.messages])

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-xs text-muted-foreground">Cargando conversación...</p>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground gap-2">
        <MessageSquare className="h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm font-medium">Conversación no encontrada</p>
      </div>
    )
  }

  const isBotActive = conversation.status === "Bot"
  const isHuman = conversation.status === "Human"
  const isInQueue = conversation.status === "InQueue"
  const isClosed = conversation.status === "Closed"
  const window24h = conversation.messagingWindow

  const disabledReason = isBotActive
    ? "El Bot de IA está respondiendo automáticamente. Tomá el control para responder como agente."
    : isInQueue
    ? "La conversación está en cola de espera. Tomá el control para responder."
    : isClosed
    ? "La conversación está resuelta. Podés reabrirla para enviar mensajes."
    : undefined

  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden bg-background">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b px-5 py-3.5 shrink-0 bg-background/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
            {conversation.contactName
              ? conversation.contactName.slice(0, 2).toUpperCase()
              : "WA"}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-sm text-foreground">
                {conversation.contactName || conversation.contactExternalId}
              </h2>
              <span className="text-xs text-muted-foreground font-mono">
                {conversation.contactExternalId}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-0.5">
              <ChannelBadge channel={conversation.channelType} />
              <StatusBadge status={conversation.status} />
              {conversation.referralJson && (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-purple-500/10 text-purple-600 border border-purple-200 dark:border-purple-800">
                  Anuncio
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls & Countdown */}
        <div className="flex items-center gap-3">
          <WindowCountdown lastUserMessageAt={conversation.messages.filter(m => m.direction === "Inbound").slice(-1)[0]?.createdAt ?? null} />

          {(isBotActive || isInQueue) && (
            <TakeControlButton conversationId={conversationId} />
          )}

          {isHuman && (
            <ResolveButton conversationId={conversationId} />
          )}

          {isClosed && (
            <ReopenButton conversationId={conversationId} />
          )}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto p-5 bg-muted/10">
        {conversation.messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center text-muted-foreground gap-2">
            <MessageSquare className="h-8 w-8 text-muted-foreground/30" />
            <p className="text-xs">No hay mensajes aún en esta conversación.</p>
          </div>
        ) : (
          conversation.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Message Input with State-aware validations */}
      <MessageInput
        conversationId={conversationId}
        disabled={!isHuman}
        disabledReason={disabledReason}
        is24hExpired={window24h ? !window24h.isWithin24Hours : false}
        channelType={conversation.channelType}
      />
    </div>
  )
}
