import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getChannelsOverview,
  connectWhatsApp,
  connectInstagram,
  connectMessenger,
  disconnectChannel,
} from "../services/channels"
import type {
  ConnectWhatsAppPayload,
  ConnectInstagramPayload,
  ConnectMessengerPayload,
} from "../types/api.types"

export function useChannelsOverview() {
  return useQuery({
    queryKey: ["channels-overview"],
    queryFn: () => getChannelsOverview(),
  })
}

export function useConnectWhatsApp() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ConnectWhatsAppPayload) => connectWhatsApp(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels-overview"] })
    },
  })
}

export function useConnectInstagram() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ConnectInstagramPayload) => connectInstagram(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels-overview"] })
    },
  })
}

export function useConnectMessenger() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ConnectMessengerPayload) => connectMessenger(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels-overview"] })
    },
  })
}

export function useDisconnectChannel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (channelType: string) => disconnectChannel(channelType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels-overview"] })
    },
  })
}
