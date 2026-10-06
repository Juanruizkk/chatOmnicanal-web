import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sendMessage } from "../services/messages"
import type { ConversationDetailDto } from "../types/api.types"

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (content: string) => sendMessage(conversationId, content),
    onSuccess: (newMessage) => {
      queryClient.setQueryData<ConversationDetailDto>(
        ["conversation", conversationId],
        (old) => {
          if (!old) return old
          const exists = old.messages.some((m) => m.id === newMessage.id)
          if (exists) return old
          return {
            ...old,
            messages: [...old.messages, newMessage],
          }
        }
      )
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    },
  })
}
