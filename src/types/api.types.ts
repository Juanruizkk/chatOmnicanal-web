export type ChannelType = "WhatsApp" | "Instagram" | "Messenger"
export type ConversationStatus = "Bot" | "Human" | "InQueue" | "Closed"
export type MessageDirection = "Inbound" | "Outbound"
export type MessageAuthor = "User" | "Bot" | "Agent"
export type UserRole = "Owner" | "Agent"

export interface Conversation {
  id: string
  tenantId: string
  channelId: string
  contactId: string
  status: ConversationStatus
  assignedAgentId: string | null
  lastUserMessageAt: string | null
  referralJson: string | null
  createdAt: string
  updatedAt: string
  contact: Contact
  channel: { type: ChannelType }
  lastMessage?: Message
}

export interface Contact {
  id: string
  externalId: string
  name: string | null
  channelType: ChannelType
}

export interface Message {
  id: string
  conversationId: string
  direction: MessageDirection
  author: MessageAuthor
  content: string
  externalId: string
  deliveryStatus: string | null
  createdAt: string
}

export interface TenantProfile {
  id: string
  tenantId: string
  address: string | null
  timezone: string | null
  contactPhone: string | null
  contactEmail: string | null
  tone: string | null
  businessHoursJson: string
  shippingInfo: string | null
  paymentMethods: string | null
}

export interface KnowledgeDoc {
  id: string
  tenantId: string
  name: string
  type: string
  status: "pending" | "processing" | "ready" | "error"
  createdAt: string
}

export interface AgentMembership {
  id: string
  userId: string
  role: UserRole
  user: { id: string; email: string; name: string }
}

export interface ConversationsFilters {
  channel?: ChannelType
  status?: ConversationStatus
  agentId?: string
  source?: "organic" | "ad"
}

export interface SendMessageRequest {
  content: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
