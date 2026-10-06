import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getConversations,
  getConversation,
  takeControl,
  resolveConversation,
  reopenConversation,
} from "../services/conversations"
import type { ConversationsFilters } from "../types/api.types"

export function useConversations(filters?: ConversationsFilters) {
  return useQuery({
    queryKey: ["conversations", filters],
    queryFn: () => getConversations(filters),
  })
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: ["conversation", id],
    queryFn: () => getConversation(id),
    enabled: !!id,
  })
}

export function useTakeControl(conversationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (agentUserId?: string) => takeControl(conversationId, agentUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversation", conversationId] })
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    },
  })
}

export function useResolve(conversationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => resolveConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversation", conversationId] })
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    },
  })
}

export function useReopen(conversationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => reopenConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversation", conversationId] })
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    },
  })
}
