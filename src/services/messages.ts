import { apiClient } from "../lib/apiClient"
import type { Message, PaginatedResponse, SendMessageRequest } from "../types/api.types"

export const messagesService = {
  list: async (conversationId: string): Promise<PaginatedResponse<Message>> => {
    const { data } = await apiClient.get(`/api/conversations/${conversationId}/messages`)
    return data
  },

  send: async (conversationId: string, body: SendMessageRequest): Promise<Message> => {
    const { data } = await apiClient.post(`/api/conversations/${conversationId}/messages`, body)
    return data
  },
}
