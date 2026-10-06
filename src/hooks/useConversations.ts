import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { conversationsService } from "../services/conversations"
import type { ConversationsFilters } from "../types/api.types"

export function useConversations(filters?: ConversationsFilters) {
  return useQuery({
    queryKey: ["conversations", filters],
    queryFn: () => conversationsService.list(filters),
  })
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: ["conversations", id],
    queryFn: () => conversationsService.getById(id),
    enabled: !!id,
  })
}

export function useTakeControl(conversationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => conversationsService.takeControl(conversationId),
    onSuccess: (updated) => {
      queryClient.setQueryData(["conversations", conversationId], updated)
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    },
  })
}

export function useResolve(conversationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => conversationsService.resolve(conversationId),
    onSuccess: (updated) => {
      queryClient.setQueryData(["conversations", conversationId], updated)
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    },
  })
}
