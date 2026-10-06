import { apiClient } from "../lib/apiClient"
import type {
  ConversationDetailDto,
  ConversationDto,
  ConversationsFilters,
} from "../types/api.types"

export async function getConversations(
  filters: ConversationsFilters = {}
): Promise<ConversationDto[]> {
  const params: Record<string, string | number> = {}
  if (filters.channelType) params.channelType = filters.channelType
  if (filters.status) params.status = filters.status
  if (filters.assignedAgentId) params.assignedAgentId = filters.assignedAgentId
  if (filters.searchQuery) params.searchQuery = filters.searchQuery
  if (filters.page) params.page = filters.page
  if (filters.pageSize) params.pageSize = filters.pageSize

  const res = await apiClient.get<ConversationDto[]>("/api/conversations", { params })
  return res.data
}

export async function getConversation(id: string): Promise<ConversationDetailDto> {
  const res = await apiClient.get<ConversationDetailDto>(`/api/conversations/${id}`)
  return res.data
}

export async function takeControl(id: string, agentUserId?: string): Promise<ConversationDto> {
  const res = await apiClient.post<ConversationDto>(`/api/conversations/${id}/take-control`, {
    assignedToUserId: agentUserId,
  })
  return res.data
}

export async function resolveConversation(id: string): Promise<ConversationDto> {
  const res = await apiClient.post<ConversationDto>(`/api/conversations/${id}/resolve`)
  return res.data
}

export async function reopenConversation(id: string): Promise<ConversationDto> {
  const res = await apiClient.post<ConversationDto>(`/api/conversations/${id}/reopen`)
  return res.data
}
