import { cn } from "../../lib/utils"
import type { Message } from "../../types/api.types"

const authorLabel: Record<string, string> = {
  Bot: "Bot",
  Agent: "Agente",
  User: "",
}

export function MessageBubble({ message }: { message: Message }) {
  const isOutbound = message.direction === "Outbound"

  return (
    <div className={cn("flex flex-col gap-0.5 max-w-[70%]", isOutbound ? "items-end self-end" : "items-start self-start")}>
      {message.author !== "User" && (
        <span className="text-xs text-muted-foreground px-1">
          {authorLabel[message.author]}
        </span>
      )}
      <div
        className={cn(
          "rounded-2xl px-3 py-2 text-sm leading-relaxed",
          isOutbound
            ? message.author === "Bot"
              ? "bg-slate-100 text-slate-800"
              : "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        {message.content}
      </div>
      <span className="text-[10px] text-muted-foreground px-1">
        {new Date(message.createdAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
        {isOutbound && message.deliveryStatus === "read" && " · leído"}
      </span>
    </div>
  )
}
