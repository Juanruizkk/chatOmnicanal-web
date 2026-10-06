import { useState } from "react"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { useSendMessage } from "../../hooks/useMessages"
import { Send, AlertCircle, Bot } from "lucide-react"

interface Props {
  conversationId: string
  disabled?: boolean
  disabledReason?: string
  is24hExpired?: boolean
  channelType?: string
}

export function MessageInput({
  conversationId,
  disabled,
  disabledReason,
  is24hExpired,
  channelType,
}: Props) {
  const [content, setContent] = useState("")
  const { mutate, isPending } = useSendMessage(conversationId)

  const send = () => {
    if (!content.trim() || disabled || is24hExpired) return
    mutate(content.trim(), {
      onSuccess: () => setContent(""),
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  if (is24hExpired && channelType === "WhatsApp") {
    return (
      <div className="flex items-center gap-2 p-3 bg-amber-500/10 border-t border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>
          La ventana de 24 horas de WhatsApp ha expirado. Solo puedes enviar
          plantillas autorizadas por Meta para restablecer la conversación.
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col border-t bg-background p-3 gap-2">
      {disabled && disabledReason && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md">
          <Bot className="h-3.5 w-3.5 text-purple-500" />
          <span>{disabledReason}</span>
        </div>
      )}

      <div className="flex items-end gap-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled
              ? "Tomá control de la conversación para responder…"
              : "Escribí una respuesta como agente (Enter para enviar)..."
          }
          disabled={disabled || isPending}
          rows={2}
          className="resize-none text-sm min-h-[44px] max-h-32"
        />
        <Button
          size="icon"
          onClick={send}
          disabled={disabled || isPending || !content.trim()}
          className="h-10 w-10 shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
