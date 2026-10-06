import { cn } from "../../lib/utils"
import type { MessageDto } from "../../types/api.types"
import { Bot, UserCheck } from "lucide-react"

export function MessageBubble({ message }: { message: MessageDto }) {
  const isOutbound = message.direction === "Outbound"
  const isBot = message.author === "Bot"
  const isAgent = message.author === "Agent"

  return (
    <div
      className={cn(
        "flex flex-col gap-1 max-w-[75%] sm:max-w-[70%]",
        isOutbound ? "items-end self-end" : "items-start self-start"
      )}
    >
      {/* Author badge if outbound */}
      {isOutbound && (
        <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground px-1">
          {isBot && (
            <>
              <Bot className="h-3 w-3 text-purple-500" />
              <span className="text-purple-600 dark:text-purple-400">Bot IA</span>
            </>
          )}
          {isAgent && (
            <>
              <UserCheck className="h-3 w-3 text-primary" />
              <span className="text-primary">Agente</span>
            </>
          )}
        </div>
      )}

      {/* Bubble */}
      <div
        className={cn(
          "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm",
          isOutbound
            ? isBot
              ? "bg-purple-50 dark:bg-purple-950/40 text-purple-950 dark:text-purple-100 border border-purple-200/60 dark:border-purple-800/60 rounded-tr-sm"
              : "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-muted/90 text-foreground border border-border/40 rounded-tl-sm"
        )}
      >
        {message.content}
      </div>

      {/* Footer Timestamp & Delivery */}
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground px-1 font-medium">
        <span>
          {new Date(message.createdAt).toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        {isOutbound && message.deliveryStatus && (
          <span className="capitalize"> · {message.deliveryStatus}</span>
        )}
      </div>
    </div>
  )
}
