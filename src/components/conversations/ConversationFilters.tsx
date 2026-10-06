import type { ConversationsFilters, ChannelType, ConversationStatus } from "../../types/api.types"

interface Props {
  filters: ConversationsFilters
  onChange: (f: ConversationsFilters) => void
}

const channels: { value: ChannelType | ""; label: string }[] = [
  { value: "", label: "Todos los canales" },
  { value: "WhatsApp", label: "WhatsApp" },
  { value: "Instagram", label: "Instagram" },
  { value: "Messenger", label: "Messenger" },
]

const statuses: { value: ConversationStatus | ""; label: string }[] = [
  { value: "", label: "Todos los estados" },
  { value: "Bot", label: "Bot" },
  { value: "Human", label: "Humano" },
  { value: "InQueue", label: "En cola" },
  { value: "Closed", label: "Cerradas" },
]

export function ConversationFilters({ filters, onChange }: Props) {
  return (
    <div className="flex gap-2 p-3 border-b">
      <select
        className="flex-1 rounded-md border border-input bg-background px-2 py-1 text-sm"
        value={filters.channel ?? ""}
        onChange={e => onChange({ ...filters, channel: (e.target.value as ChannelType) || undefined })}
      >
        {channels.map(c => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>

      <select
        className="flex-1 rounded-md border border-input bg-background px-2 py-1 text-sm"
        value={filters.status ?? ""}
        onChange={e => onChange({ ...filters, status: (e.target.value as ConversationStatus) || undefined })}
      >
        {statuses.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
    </div>
  )
}
