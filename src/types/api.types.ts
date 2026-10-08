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

// ── Admin ──────────────────────────────────────────────────────────────────

export interface TenantAdminDto {
  id: string
  name: string
  plan: string
  status: string
  conversationQuota: number | null
  activeChannels: number
  conversationsLast30Days: number
  tokensLast30Days: number
  estimatedCostUsd: number
  totalPaidUsd: number
  hasOverduePayment: boolean
  isNearQuota: boolean
  createdAt: string
  updatedAt: string
}

export interface TenantKpiDto {
  totalTenants: number
  activeTenants: number
  suspendedTenants: number
  tenantsWithAlerts: number
  totalTokensLast30Days: number
  totalEstimatedCostUsd: number
  totalCollectedUsd: number
}

export interface TenantStatsDto {
  conversationsLast30Days: number
  conversationsAllTime: number
  messagesLast30Days: number
  messagesAllTime: number
  inputTokensLast30Days: number
  outputTokensLast30Days: number
  estimatedCostUsdLast30Days: number
  estimatedCostUsdAllTime: number
  activeChannels: number
  dailyConversations: { date: string; count: number }[]
}

export interface PaymentDto {
  id: string
  tenantId: string
  amount: number
  currency: string
  status: string
  description: string | null
  externalReference: string | null
  periodStart: string
  periodEnd: string
  registeredByUserId: string
  createdAt: string
}

export interface BillingInfoDto {
  id: string | null
  companyName: string | null
  taxId: string | null
  billingEmail: string | null
  address: string | null
  country: string | null
  notes: string | null
}

export interface LlmPricingDto {
  id: string
  modelId: string
  displayName: string
  inputPricePerMillionTokens: number
  outputPricePerMillionTokens: number
  isActive: boolean
  updatedAt: string
}

export interface AuditLogEntryDto {
  id: string
  tenantId: string | null
  tenantName: string | null
  adminUserId: string
  action: string
  details: string | null
  ipAddress: string | null
  createdAt: string
}

export interface UpdateTenantConfigRequest {
  plan: string
  status: string
  conversationQuota: number | null
  internalNotes: string | null
}

export interface RegisterPaymentRequest {
  amount: number
  currency: string
  status: string
  description: string | null
  externalReference: string | null
  periodStart: string
  periodEnd: string
}

export interface AdminTenantsFilters {
  search?: string
  status?: string
  plan?: string
  page?: number
  pageSize?: number
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
}

