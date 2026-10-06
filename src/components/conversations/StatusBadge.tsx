import type { ConversationStatus } from "../../types/api.types"

const labels: Record<ConversationStatus, string> = {
  Bot: "Bot",
  Human: "Humano",
  InQueue: "En cola",
  Closed: "Cerrada",
}

const colors: Record<ConversationStatus, string> = {
  Bot: "bg-slate-100 text-slate-700",
  Human: "bg-orange-100 text-orange-700",
  InQueue: "bg-yellow-100 text-yellow-700",
  Closed: "bg-gray-100 text-gray-500",
}

export function StatusBadge({ status }: { status: ConversationStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status]}`}>
      {labels[status]}
    </span>
  )
}
