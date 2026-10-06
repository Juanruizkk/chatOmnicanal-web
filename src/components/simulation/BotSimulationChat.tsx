import { useState, useRef, useEffect } from "react"
import { apiClient } from "../../lib/apiClient"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Send, Bot } from "lucide-react"
import { cn } from "../../lib/utils"

interface SimMessage {
  id: string
  role: "user" | "bot"
  content: string
}

export function BotSimulationChat() {
  const [messages, setMessages] = useState<SimMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg: SimMessage = { id: `u-${Date.now()}`, role: "user", content: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const { data } = await apiClient.post<{ content: string }>("/api/simulation/message", { content: userMsg.content })
      setMessages(prev => [...prev, { id: `b-${Date.now()}`, role: "bot", content: data.content }])
    } catch {
      setMessages(prev => [...prev, { id: `e-${Date.now()}`, role: "bot", content: "Error al conectar con el bot." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto border rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 border-b px-4 py-3 bg-muted/40">
        <Bot className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Simulación del bot</span>
        <span className="text-xs text-muted-foreground">— los mensajes no llegan a WhatsApp</span>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-8">
            Escribí un mensaje para probar cómo responde el bot.
          </p>
        )}
        {messages.map(msg => (
          <div
            key={msg.id}
            className={cn(
              "max-w-[70%] rounded-2xl px-3 py-2 text-sm",
              msg.role === "user"
                ? "self-end bg-primary text-primary-foreground"
                : "self-start bg-muted text-foreground"
            )}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="self-start bg-muted rounded-2xl px-3 py-2 text-sm text-muted-foreground">
            Escribiendo…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-end gap-2 p-3 border-t">
        <Textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Escribí como si fueras un cliente..."
          rows={2}
          className="resize-none"
          disabled={loading}
        />
        <Button size="icon" onClick={send} disabled={loading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
