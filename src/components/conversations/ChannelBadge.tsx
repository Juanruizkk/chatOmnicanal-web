import type { ChannelType } from "../../types/api.types"

const labels: Record<ChannelType, string> = {
  WhatsApp: "WhatsApp",
  Instagram: "Instagram",
  Messenger: "Messenger",
}

const colors: Record<ChannelType, string> = {
  WhatsApp: "bg-green-100 text-green-800",
  Instagram: "bg-pink-100 text-pink-800",
  Messenger: "bg-blue-100 text-blue-800",
}

export function ChannelBadge({ channel }: { channel: ChannelType }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[channel]}`}>
      {labels[channel]}
    </span>
  )
}
