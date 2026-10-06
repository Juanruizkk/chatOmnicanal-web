import { create } from "zustand"
import type { MessageDto, ConversationDto } from "../types/api.types"

export type SignalRConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting"

interface SignalRState {
  status: SignalRConnectionStatus
  setStatus: (status: SignalRConnectionStatus) => void
  lastMessage: { conversationId: string; message: MessageDto } | null
  setLastMessage: (payload: { conversationId: string; message: MessageDto } | null) => void
  lastUpdatedConversation: ConversationDto | null
  setLastUpdatedConversation: (conversation: ConversationDto | null) => void
}

export const useSignalRStore = create<SignalRState>((set) => ({
  status: "disconnected",
  setStatus: (status) => set({ status }),
  lastMessage: null,
  setLastMessage: (lastMessage) => set({ lastMessage }),
  lastUpdatedConversation: null,
  setLastUpdatedConversation: (lastUpdatedConversation) => set({ lastUpdatedConversation }),
}))
