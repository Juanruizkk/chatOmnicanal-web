import { apiClient } from "../lib/apiClient"
import type {
  ChannelsOverviewResponse,
  ChannelItemDto,
  ConnectWhatsAppPayload,
  ConnectInstagramPayload,
  ConnectMessengerPayload,
} from "../types/api.types"

export async function getChannelsOverview(): Promise<ChannelsOverviewResponse> {
  const res = await apiClient.get<ChannelsOverviewResponse>("/api/channels")
  return res.data
}

export async function connectWhatsApp(payload: ConnectWhatsAppPayload): Promise<ChannelItemDto> {
  const res = await apiClient.post<ChannelItemDto>("/api/channels/whatsapp", payload)
  return res.data
}

export async function connectInstagram(payload: ConnectInstagramPayload): Promise<ChannelItemDto> {
  const res = await apiClient.post<ChannelItemDto>("/api/channels/instagram", payload)
  return res.data
}

export async function connectMessenger(payload: ConnectMessengerPayload): Promise<ChannelItemDto> {
  const res = await apiClient.post<ChannelItemDto>("/api/channels/messenger", payload)
  return res.data
}

export async function disconnectChannel(channelType: string): Promise<void> {
  await apiClient.delete(`/api/channels/${channelType}`)
}
