import { useEffect, useRef } from "react"
import { useConversation } from "../../hooks/useConversations"
import { useMessages } from "../../hooks/useMessages"
import { MessageBubble } from "./MessageBubble"
import { MessageInput } from "./MessageInput"
import { TakeControlButton } from "./TakeControlButton"
import { ResolveButton } from "./ResolveButton"
import { WindowCountdown } from "./WindowCountdown"
import { ChannelBadge } from "../conversations/ChannelBadge"
import { StatusBadge } from "../conversations/StatusBadge"

export function ChatView({ conversationId }: { conversationId: string }) {
  const { data: conversation, isLoading: convLoading } = useConversation(conversationId)
  const { data: messagesData, isLoading: msgsLoading } = useMessages(conversationId)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messagesData])

  if (convLoading || msgsLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!conversation) return <div className="flex flex-1 items-center justify-center text-muted-foreground">Conversación no encontrada</div>

  const isBotActive = conversation.status === "Bot"
  const isHuman = conversation.status === "Human"
  const isInQueue = conversation.status === "InQueue"
  const isClosed = conversation.status === "Closed"

  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <div>
            <p className="font-medium text-sm">
              {conversation.contact.name ?? conversation.contact.externalId}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <ChannelBadge channel={conversation.channel.type} />
              <StatusBadge status={conversation.status} />
              {conversation.referralJson && (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700">
                  Anuncio
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <WindowCountdown lastUserMessageAt={conversation.lastUserMessageAt} />
          {(isBotActive || isInQueue) && (
            <TakeControlButton conversationId={conversationId} />
          )}
          {isHuman && (
            <ResolveButton conversationId={conversationId} />
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {messagesData?.items.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput conversationId={conversationId} disabled={!isHuman} />

      {isClosed && (
        <div className="border-t p-3 text-center text-xs text-muted-foreground">
          Conversación cerrada. El próximo mensaje del usuario la reabre.
        </div>
      )}
    </div>
  )
}
