export type ChannelType = "WhatsApp" | "Instagram" | "Messenger"
export type ConversationStatus = "Bot" | "Human" | "InQueue" | "Closed"
export type MessageDirection = "Inbound" | "Outbound"
export type MessageAuthor = "User" | "Bot" | "Agent"
export type UserRole = "Owner" | "Agent"

export interface MessagingWindow {
  isWithin24Hours: boolean
  remainingMinutes: number
  expiresAt: string | null
  canSendFreeForm: boolean
  canSendHumanAgentTag: boolean
}

export interface MessageDto {
  id: string
  direction: MessageDirection
  author: MessageAuthor
  content: string
  deliveryStatus: string | null
  createdAt: string
}

export interface ConversationDto {
  id: string
  tenantId: string
  channelType: ChannelType
  contactName: string
  contactExternalId: string
  status: ConversationStatus
  assignedAgentId: string | null
  assignedAgentName: string | null
  lastUserMessageAt: string | null
  lastMessageSnippet: string | null
  lastMessageAt: string | null
  messagingWindow: MessagingWindow
  referralJson: string | null
  createdAt: string
}

export interface ConversationDetailDto {
  id: string
  tenantId: string
  channelType: ChannelType
  contactName: string
  contactExternalId: string
  status: ConversationStatus
  assignedAgentId: string | null
  assignedAgentName: string | null
  messagingWindow: MessagingWindow
  referralJson: string | null
  messages: MessageDto[]
  createdAt: string
}

export interface TenantProfile {
  id?: string
  tenantId?: string
  address: string | null
  timezone: string | null
  contactPhone: string | null
  contactEmail: string | null
  tone: string | null
  businessHoursJson: string
  shippingInfo: string | null
  paymentMethods: string | null
}

export interface KnowledgeChunk {
  chunkId: string
  docId: string
  content: string
  similarity: number
}

export interface KnowledgeDoc {
  id: string
  tenantId: string
  filename: string
  docType: string
  status: "processing" | "ready" | "failed"
  chunkCount: number
  errorMessage: string | null
  createdAt: string
}

export interface AgentMembership {
  id: string
  userId: string
  role: UserRole
  user: { id: string; email: string; name: string }
}

export interface PendingInvitation {
  id: string
  email: string
  role: UserRole
  createdAt: string
}

export interface TenantDto {
  id: string
  name: string
  plan: string
  status: string
}

export interface MeDto {
  user: { id: string; email: string; name: string }
  tenant: TenantDto | null
  role: UserRole | null
}

export interface ConversationsFilters {
  channelType?: ChannelType
  status?: ConversationStatus
  assignedAgentId?: string
  searchQuery?: string
  page?: number
  pageSize?: number
}

export interface SendMessageRequest {
  content: string
}

export interface BotChatMessage {
  role: "user" | "assistant"
  content: string
}

export interface BotSimulateRequest {
  userMessage: string
  history?: BotChatMessage[]
}

export interface BotSimulateResponse {
  replyText: string
  shouldHandoff: boolean
  handoffReason: string | null
  inputTokens: number
  outputTokens: number
  retrievedChunks: KnowledgeChunk[]
}

export interface ChannelItemDto {
  id: string
  tenantId: string
  type: ChannelType
  status: "Active" | "Inactive" | "Error"
  phoneNumberId: string | null
  wabaId: string | null
  igUserId: string | null
  pageId: string | null
  hasAccessToken: boolean
  createdAt: string
  updatedAt: string
}

export interface WebhookInfo {
  whatsAppCallbackUrl: string
  instagramCallbackUrl: string
  messengerCallbackUrl: string
  verifyToken: string
}

export interface ChannelsOverviewResponse {
  channels: ChannelItemDto[]
  webhookInfo: WebhookInfo
}

export interface ConnectWhatsAppPayload {
  phoneNumberId: string
  wabaId?: string
  accessToken: string
}

export interface ConnectInstagramPayload {
  igUserId: string
  accessToken: string
}

export interface ConnectMessengerPayload {
  pageId: string
  accessToken: string
}

