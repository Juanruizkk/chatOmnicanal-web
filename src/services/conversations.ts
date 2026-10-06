import { apiClient } from "../lib/apiClient"
import type { Conversation, ConversationsFilters, PaginatedResponse } from "../types/api.types"

export const conversationsService = {
  list: async (filters?: ConversationsFilters): Promise<PaginatedResponse<Conversation>> => {
    const { data } = await apiClient.get("/api/conversations", { params: filters })
    return data
  },

  getById: async (id: string): Promise<Conversation> => {
    const { data } = await apiClient.get(`/api/conversations/${id}`)
    return data
  },

  takeControl: async (id: string): Promise<Conversation> => {
    const { data } = await apiClient.post(`/api/conversations/${id}/take-control`)
    return data
  },

  resolve: async (id: string): Promise<Conversation> => {
    const { data } = await apiClient.post(`/api/conversations/${id}/resolve`)
    return data
  },
}
