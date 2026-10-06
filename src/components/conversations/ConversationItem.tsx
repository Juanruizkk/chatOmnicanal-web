import { NavLink } from "react-router-dom"
import { cn } from "../../lib/utils"
import { ChannelBadge } from "./ChannelBadge"
import { StatusBadge } from "./StatusBadge"
import type { Conversation } from "../../types/api.types"

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}

export function ConversationItem({ conversation }: { conversation: Conversation }) {
  const isAd = !!conversation.referralJson

  return (
    <NavLink
      to={`/conversations/${conversation.id}`}
      className={({ isActive }) =>
        cn(
          "flex flex-col gap-1 p-3 hover:bg-muted cursor-pointer border-b transition-colors",
          isActive && "bg-muted"
        )
      }
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm truncate">
          {conversation.contact.name ?? conversation.contact.externalId}
        </span>
        <span className="text-xs text-muted-foreground shrink-0 ml-2">
          {conversation.lastUserMessageAt
            ? timeAgo(conversation.lastUserMessageAt)
            : ""}
        </span>
      </div>
      <p className="text-xs text-muted-foreground truncate">
        {conversation.lastMessage?.content ?? "Sin mensajes"}
      </p>
      <div className="flex items-center gap-1 flex-wrap">
        <ChannelBadge channel={conversation.channel.type} />
        <StatusBadge status={conversation.status} />
        {isAd && (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700">
            Anuncio
          </span>
        )}
      </div>
    </NavLink>
  )
}
