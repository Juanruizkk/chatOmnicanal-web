import { apiClient } from "../lib/apiClient"
import type { MessageDto } from "../types/api.types"

export async function sendMessage(
  conversationId: string,
  content: string
): Promise<MessageDto> {
  const res = await apiClient.post<MessageDto>(
    `/api/conversations/${conversationId}/messages`,
    { content }
  )
  return res.data
}
