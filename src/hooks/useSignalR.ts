import { useEffect, useRef } from "react"
import { useAuth } from "@clerk/clerk-react"
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr"
import { useQueryClient } from "@tanstack/react-query"
import { useSignalRStore } from "../store/signalRStore"
import type {
  ConversationDetailDto,
  ConversationDto,
  MessageDto,
} from "../types/api.types"

export function useSignalR() {
  const { getToken, isSignedIn } = useAuth()
  const queryClient = useQueryClient()
  const setStatus = useSignalRStore((s) => s.setStatus)
  const setLastMessage = useSignalRStore((s) => s.setLastMessage)
  const setLastUpdatedConversation = useSignalRStore((s) => s.setLastUpdatedConversation)
  const connectionRef = useRef<HubConnection | null>(null)

  useEffect(() => {
    if (!isSignedIn) {
      if (connectionRef.current) {
        connectionRef.current.stop()
        connectionRef.current = null
        setStatus("disconnected")
      }
      return
    }

    const hubUrl = `${import.meta.env.VITE_API_URL ?? "http://localhost:8080"}/hubs/chat`

    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: async () => {
          try {
            const token = await getToken()
            return token ?? ""
          } catch {
            return ""
          }
        },
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Warning)
      .build()

    connectionRef.current = connection

    // Event listeners
    connection.on("ReceiveMessage", (conversationId: string, message: MessageDto) => {
      setLastMessage({ conversationId, message })

      // Optimistic cache update for conversation detail
      queryClient.setQueryData<ConversationDetailDto>(
        ["conversation", conversationId],
        (old) => {
          if (!old) return old
          const exists = old.messages.some((m) => m.id === message.id)
          if (exists) return old
          return {
            ...old,
            messages: [...old.messages, message],
          }
        }
      )

      // Invalidate list to refresh last message previews and sort order
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    })

    connection.on("ConversationUpdated", (conversation: ConversationDto) => {
      setLastUpdatedConversation(conversation)
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
      queryClient.invalidateQueries({ queryKey: ["conversation", conversation.id] })
    })

    connection.on("ConversationStatusChanged", (conversationId: string, _status: string) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
      queryClient.invalidateQueries({ queryKey: ["conversation", conversationId] })
    })

    connection.onreconnecting(() => {
      setStatus("reconnecting")
    })

    connection.onreconnected(() => {
      setStatus("connected")
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    })

    connection.onclose(() => {
      setStatus("disconnected")
    })

    setStatus("connecting")
    connection
      .start()
      .then(() => {
        setStatus("connected")
      })
      .catch(() => {
        setStatus("disconnected")
      })

    return () => {
      if (connection.state === HubConnectionState.Connected || connection.state === HubConnectionState.Connecting) {
        connection.stop()
      }
      connectionRef.current = null
      setStatus("disconnected")
    }
  }, [isSignedIn, getToken, queryClient, setStatus, setLastMessage, setLastUpdatedConversation])

  return connectionRef.current
}
