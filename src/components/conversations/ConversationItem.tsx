import { NavLink } from "react-router-dom"
import { cn } from "../../lib/utils"
import { ChannelBadge } from "./ChannelBadge"
import { StatusBadge } from "./StatusBadge"
import type { ConversationDto } from "../../types/api.types"
import { Clock } from "lucide-react"

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return "ahora"
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}

export function ConversationItem({ conversation }: { conversation: ConversationDto }) {
  const isAd = !!conversation.referralJson
  const window24h = conversation.messagingWindow

  return (
    <NavLink
      to={`/conversations/${conversation.id}`}
      className={({ isActive }) =>
        cn(
          "flex flex-col gap-1.5 p-3.5 hover:bg-muted/60 cursor-pointer border-b border-border/60 transition-colors relative",
          isActive && "bg-muted border-l-4 border-l-primary"
        )
      }
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm truncate text-foreground">
          {conversation.contactName || conversation.contactExternalId}
        </span>
        <span className="text-[11px] text-muted-foreground shrink-0 ml-2 font-medium">
          {conversation.lastMessageAt
            ? timeAgo(conversation.lastMessageAt)
            : conversation.lastUserMessageAt
            ? timeAgo(conversation.lastUserMessageAt)
            : ""}
        </span>
      </div>

      <p className="text-xs text-muted-foreground truncate">
        {conversation.lastMessageSnippet ?? "Sin mensajes"}
      </p>

      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
        <ChannelBadge channel={conversation.channelType} />
        <StatusBadge status={conversation.status} />
        {isAd && (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-purple-500/10 text-purple-600 border border-purple-200 dark:border-purple-800">
            Anuncio
          </span>
        )}
        {window24h && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium ml-auto",
              window24h.isWithin24Hours
                ? "bg-emerald-500/10 text-emerald-600"
                : "bg-zinc-500/10 text-zinc-500"
            )}
            title={
              window24h.isWithin24Hours
                ? `Ventana 24h activa (${Math.floor(window24h.remainingMinutes / 60)}h ${window24h.remainingMinutes % 60}m)`
                : "Ventana 24h cerrada"
            }
          >
            <Clock className="h-2.5 w-2.5" />
            {window24h.isWithin24Hours ? `${Math.floor(window24h.remainingMinutes / 60)}h` : "exp"}
          </span>
        )}
      </div>
    </NavLink>
  )
}
