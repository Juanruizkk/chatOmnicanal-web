import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { messagesService } from "../services/messages"

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => messagesService.list(conversationId),
    enabled: !!conversationId,
    refetchInterval: 5000,
  })
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (content: string) => messagesService.send(conversationId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] })
    },
  })
}
