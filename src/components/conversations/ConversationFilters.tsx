import { Search } from "lucide-react"
import type {
  ConversationsFilters,
  ChannelType,
  ConversationStatus,
} from "../../types/api.types"

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

const statusTabs: { value: ConversationStatus | ""; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "Bot", label: "Bot" },
  { value: "InQueue", label: "En cola" },
  { value: "Human", label: "Humanos" },
  { value: "Closed", label: "Cerrados" },
]

export function ConversationFilters({ filters, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2 p-3 border-b bg-background/50">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por contacto o mensaje..."
          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          value={filters.searchQuery ?? ""}
          onChange={(e) =>
            onChange({ ...filters, searchQuery: e.target.value || undefined })
          }
        />
      </div>

      {/* Channel Select & Status Tabs */}
      <div className="flex items-center gap-2">
        <select
          className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          value={filters.channelType ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              channelType: (e.target.value as ChannelType) || undefined,
            })
          }
        >
          {channels.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Status Pill Tabs */}
      <div className="flex gap-1 overflow-x-auto py-1 no-scrollbar">
        {statusTabs.map((tab) => {
          const isSelected = (filters.status ?? "") === tab.value
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() =>
                onChange({
                  ...filters,
                  status: (tab.value as ConversationStatus) || undefined,
                })
              }
              className={`px-2.5 py-1 text-[11px] font-medium rounded-full whitespace-nowrap transition-colors ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
