import { useState, useRef, useEffect } from "react"
import { useBotSimulation } from "../../hooks/useBotSimulation"
import { useMe } from "../../hooks/useMe"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Send, Bot, Sparkles, AlertCircle, Database, ChevronDown, ChevronUp, RotateCcw } from "lucide-react"
import { cn } from "../../lib/utils"
import type { BotChatMessage, KnowledgeChunk } from "../../types/api.types"

interface SimMessage {
  id: string
  role: "user" | "assistant"
  content: string
  shouldHandoff?: boolean
  handoffReason?: string | null
  inputTokens?: number
  outputTokens?: number
  retrievedChunks?: KnowledgeChunk[]
}

export function BotSimulationChat() {
  const { data: me } = useMe()
  const [messages, setMessages] = useState<SimMessage[]>([])
  const [input, setInput] = useState("")
  const [expandedChunksMessageId, setExpandedChunksMessageId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const { mutateAsync: simulate, isPending: loading } = useBotSimulation()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleReset = () => {
    setMessages([])
    setInput("")
  }

  const send = async () => {
    if (!input.trim() || loading) return
    const userText = input.trim()
    const userMsg: SimMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: userText,
    }

    const currentHistory: BotChatMessage[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }))

    setMessages((prev) => [...prev, userMsg])
    setInput("")

    try {
      const response = await simulate({
        userMessage: userText,
        history: currentHistory,
      })

      const botMsg: SimMessage = {
        id: `b-${Date.now()}`,
        role: "assistant",
        content: response.replyText,
        shouldHandoff: response.shouldHandoff,
        handoffReason: response.handoffReason,
        inputTokens: response.inputTokens,
        outputTokens: response.outputTokens,
        retrievedChunks: response.retrievedChunks,
      }

      setMessages((prev) => [...prev, botMsg])

      // Mark simulation step as completed for onboarding
      const tenantId = me?.tenant?.id || "default"
      localStorage.setItem(`bot_simulated_${tenantId}`, "true")
      window.dispatchEvent(new Event("bot-simulated"))
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          content: "Ocurrió un error al contactar el motor del bot.",
        },
      ])
    }
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto border rounded-xl overflow-hidden shadow-sm bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-5 py-3.5 bg-muted/30">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <span className="text-sm font-semibold text-foreground">Simulador del Bot IA</span>
            <p className="text-xs text-muted-foreground">
              Probá el comportamiento del bot con Groq + RAG pgvector y guardrails antes de salir a producción.
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            className="text-xs gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reiniciar
          </Button>
        )}
      </div>

      {/* Messages Feed */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5 bg-muted/10">
        {messages.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center text-center p-8 text-muted-foreground gap-3">
            <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Iniciá una conversación de prueba
              </p>
              <p className="text-xs text-muted-foreground max-w-sm mt-1">
                Escribí consultas como "¿Qué medios de pago tienen?", "¿Hacen envíos a Córdoba?" o pedí "Hablar con un asesor" para ver la derivación.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === "user"
          const hasChunks = msg.retrievedChunks && msg.retrievedChunks.length > 0
          const isChunksExpanded = expandedChunksMessageId === msg.id

          return (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col gap-1.5 max-w-[85%] sm:max-w-[75%]",
                isUser ? "self-end items-end" : "self-start items-start"
              )}
            >
              {/* Message Header */}
              {!isUser && (
                <div className="flex items-center gap-1.5 text-xs text-purple-600 font-medium px-1">
                  <Bot className="h-3.5 w-3.5" />
                  <span>Bot Llama 3.3 (Groq)</span>
                  {msg.shouldHandoff && (
                    <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full text-[10px] font-semibold ml-1">
                      <AlertCircle className="h-3 w-3" />
                      Handoff derivado a humano
                    </span>
                  )}
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm whitespace-pre-wrap",
                  isUser
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-background border border-border/80 text-foreground rounded-tl-sm"
                )}
              >
                {msg.content}
              </div>

              {/* Metadata & RAG inspection */}
              {!isUser && (
                <div className="flex flex-col gap-1.5 w-full px-1">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    {msg.inputTokens !== undefined && (
                      <span>
                        Tokens: {msg.inputTokens} in / {msg.outputTokens} out
                      </span>
                    )}

                    {hasChunks && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedChunksMessageId(isChunksExpanded ? null : msg.id)
                        }
                        className="inline-flex items-center gap-1 text-primary hover:underline font-medium ml-auto"
                      >
                        <Database className="h-3 w-3" />
                        {msg.retrievedChunks!.length} fragmentos RAG
                        {isChunksExpanded ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Expandable Chunks list */}
                  {isChunksExpanded && hasChunks && (
                    <div className="border rounded-lg p-3 bg-muted/40 space-y-2 mt-1 text-xs animate-in fade-in duration-150">
                      <p className="font-semibold text-foreground flex items-center gap-1.5">
                        <Database className="h-3.5 w-3.5 text-primary" />
                        Fragmentos pgvector recuperados:
                      </p>
                      {msg.retrievedChunks!.map((chunk, idx) => (
                        <div
                          key={chunk.chunkId || idx}
                          className="bg-background border rounded p-2.5 space-y-1 text-foreground"
                        >
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <span className="font-mono">Doc #{chunk.docId?.slice(0, 8)}</span>
                            <span className="bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded font-medium">
                              Similitud: {(chunk.similarity * 100).toFixed(1)}%
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed text-muted-foreground/90">
                            {chunk.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {loading && (
          <div className="self-start flex items-center gap-2 bg-background border rounded-2xl px-4 py-2.5 text-xs text-muted-foreground shadow-sm">
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Consultando pgvector y generando inferencia con Groq...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="flex items-end gap-2 p-3.5 border-t bg-background">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
          placeholder="Escribí una consulta para probar al bot..."
          rows={2}
          className="resize-none text-sm min-h-[44px] max-h-32"
          disabled={loading}
        />
        <Button
          size="icon"
          onClick={send}
          disabled={loading || !input.trim()}
          className="h-10 w-10 shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
