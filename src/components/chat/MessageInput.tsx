import { useState } from "react"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { useSendMessage } from "../../hooks/useMessages"
import { Send } from "lucide-react"

export function MessageInput({ conversationId, disabled }: { conversationId: string; disabled?: boolean }) {
  const [content, setContent] = useState("")
  const { mutate, isPending } = useSendMessage(conversationId)

  const send = () => {
    if (!content.trim()) return
    mutate(content.trim(), { onSuccess: () => setContent("") })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex items-end gap-2 p-3 border-t">
      <Textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? "El bot está respondiendo…" : "Escribí un mensaje (Enter para enviar)"}
        disabled={disabled || isPending}
        rows={2}
        className="resize-none"
      />
      <Button size="icon" onClick={send} disabled={disabled || isPending || !content.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </div>
  )
}
