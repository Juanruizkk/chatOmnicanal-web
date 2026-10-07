import { http, HttpResponse } from "msw"
import type {
  ConversationDto,
  ConversationDetailDto,
  MessageDto,
  TenantProfile,
  KnowledgeDoc,
  MeDto,
  PendingInvitation,
  BotSimulateRequest,
  BotSimulateResponse,
} from "../types/api.types"

const conversations: ConversationDto[] = [
  {
    id: "conv-1",
    tenantId: "tenant-1",
    channelType: "WhatsApp",
    contactName: "María López",
    contactExternalId: "5491112345678",
    status: "Bot",
    assignedAgentId: null,
    assignedAgentName: null,
    lastUserMessageAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    lastMessageSnippet: "¿Hacen envíos a Rosario?",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    messagingWindow: {
      isWithin24Hours: true,
      remainingMinutes: 1380,
      expiresAt: new Date(Date.now() + 1000 * 60 * 1380).toISOString(),
      canSendFreeForm: true,
      canSendHumanAgentTag: false,
    },
    referralJson: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "conv-2",
    tenantId: "tenant-1",
    channelType: "Instagram",
    contactName: "Carlos Ruiz",
    contactExternalId: "igsid-789",
    status: "Human",
    assignedAgentId: "user-1",
    assignedAgentName: "Juan Ruiz",
    lastUserMessageAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    lastMessageSnippet: "Quiero hablar con alguien por favor",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    messagingWindow: {
      isWithin24Hours: true,
      remainingMinutes: 1420,
      expiresAt: new Date(Date.now() + 1000 * 60 * 1420).toISOString(),
      canSendFreeForm: true,
      canSendHumanAgentTag: true,
    },
    referralJson: JSON.stringify({ headline: "Promo verano", source_id: "ad-123" }),
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "conv-3",
    tenantId: "tenant-1",
    channelType: "WhatsApp",
    contactName: "Lucía Gómez",
    contactExternalId: "5491187654321",
    status: "InQueue",
    assignedAgentId: null,
    assignedAgentName: null,
    lastUserMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    lastMessageSnippet: "Necesito hacer un reclamo",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    messagingWindow: {
      isWithin24Hours: true,
      remainingMinutes: 1320,
      expiresAt: new Date(Date.now() + 1000 * 60 * 1320).toISOString(),
      canSendFreeForm: true,
      canSendHumanAgentTag: false,
    },
    referralJson: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
]

const messages: Record<string, MessageDto[]> = {
  "conv-1": [
    {
      id: "msg-1",
      direction: "Inbound",
      author: "User",
      content: "Hola! Buenas tardes",
      deliveryStatus: "delivered",
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: "msg-2",
      direction: "Outbound",
      author: "Bot",
      content: "¡Hola! Buenas tardes, ¿en qué puedo ayudarte hoy?",
      deliveryStatus: "read",
      createdAt: new Date(Date.now() - 1000 * 60 * 59).toISOString(),
    },
    {
      id: "msg-3",
      direction: "Inbound",
      author: "User",
      content: "¿Hacen envíos a Rosario?",
      deliveryStatus: "delivered",
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
    {
      id: "msg-4",
      direction: "Outbound",
      author: "Bot",
      content: "Sí, hacemos envíos a todo el país vía Andreani en 48-72 hs.",
      deliveryStatus: "sent",
      createdAt: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
    },
  ],
  "conv-2": [
    {
      id: "msg-5",
      direction: "Inbound",
      author: "User",
      content: "Vi la promo de verano",
      deliveryStatus: "delivered",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "msg-6",
      direction: "Outbound",
      author: "Bot",
      content: "¡Hola Carlos! Contamos con hasta 20% off en productos seleccionados.",
      deliveryStatus: "read",
      createdAt: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
    },
    {
      id: "msg-7",
      direction: "Inbound",
      author: "User",
      content: "Quiero hablar con alguien por favor",
      deliveryStatus: "delivered",
      createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    },
  ],
  "conv-3": [
    {
      id: "msg-8",
      direction: "Inbound",
      author: "User",
      content: "Necesito hacer un reclamo",
      deliveryStatus: "delivered",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: "msg-9",
      direction: "Outbound",
      author: "Bot",
      content: "Actualmente nos encontramos fuera del horario de atención. Te responderemos el lunes a las 09:00 hs.",
      deliveryStatus: "delivered",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
  ],
}

const tenantProfile: TenantProfile = {
  id: "prof-1",
  tenantId: "tenant-1",
  address: "Av. Corrientes 1234, CABA",
  timezone: "America/Argentina/Buenos_Aires",
  contactPhone: "+5491112345678",
  contactEmail: "hola@tienda.com",
  tone: "amigable y profesional",
  businessHoursJson: JSON.stringify({
    monday: { open: "09:00", close: "18:00" },
    tuesday: { open: "09:00", close: "18:00" },
    wednesday: { open: "09:00", close: "18:00" },
    thursday: { open: "09:00", close: "18:00" },
    friday: { open: "09:00", close: "17:00" },
    saturday: { open: "10:00", close: "14:00" },
    sunday: null,
  }),
  shippingInfo: "Envíos a todo el país por Andreani. Costo: $4500 CABA, $6500 interior.",
  paymentMethods: "Efectivo, transferencia bancaria (10% off), Mercado Pago, tarjetas de crédito.",
}

const knowledgeDocs: KnowledgeDoc[] = [
  {
    id: "doc-1",
    tenantId: "tenant-1",
    filename: "Catálogo temporada 2026.pdf",
    docType: "pdf",
    status: "ready",
    chunkCount: 14,
    errorMessage: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "doc-2",
    tenantId: "tenant-1",
    filename: "Política de cambios y devoluciones.txt",
    docType: "text",
    status: "ready",
    chunkCount: 3,
    errorMessage: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
]

// Forma de MembershipDto de la API
const agents = [
  { id: "mem-1", userId: "user-1", userEmail: "juan@tienda.com", userName: "Juan Ruiz", role: "Owner" },
  { id: "mem-2", userId: "user-2", userEmail: "sofia@tienda.com", userName: "Sofía Martínez", role: "Agent" },
]

const invitations: PendingInvitation[] = []

const me: MeDto = {
  user: { id: "user-1", email: "juan@tienda.com", name: "Juan Ruiz" },
  tenant: { id: "tenant-1", name: "Tienda Demo", plan: "Basic", status: "Active" },
  role: "Owner",
}

export const handlers = [
  http.get("/api/conversations", ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get("status")
    const channelType = url.searchParams.get("channelType")
    const search = url.searchParams.get("searchQuery")?.toLowerCase()

    let result = [...conversations]
    if (status) result = result.filter((c) => c.status === status)
    if (channelType) result = result.filter((c) => c.channelType === channelType)
    if (search) {
      result = result.filter(
        (c) =>
          c.contactName.toLowerCase().includes(search) ||
          c.contactExternalId.includes(search) ||
          (c.lastMessageSnippet && c.lastMessageSnippet.toLowerCase().includes(search))
      )
    }

    return HttpResponse.json(result)
  }),

  http.get("/api/conversations/:id", ({ params }) => {
    const conv = conversations.find((c) => c.id === params.id)
    if (!conv) return new HttpResponse(null, { status: 404 })

    const detail: ConversationDetailDto = {
      id: conv.id,
      tenantId: conv.tenantId,
      channelType: conv.channelType,
      contactName: conv.contactName,
      contactExternalId: conv.contactExternalId,
      status: conv.status,
      assignedAgentId: conv.assignedAgentId,
      assignedAgentName: conv.assignedAgentName,
      messagingWindow: conv.messagingWindow,
      referralJson: conv.referralJson,
      messages: messages[conv.id] ?? [],
      createdAt: conv.createdAt,
    }

    return HttpResponse.json(detail)
  }),

  http.post("/api/conversations/:id/take-control", ({ params }) => {
    const conv = conversations.find((c) => c.id === params.id)
    if (!conv) return new HttpResponse(null, { status: 404 })
    conv.status = "Human"
    conv.assignedAgentId = "user-1"
    conv.assignedAgentName = "Juan Ruiz"
    return HttpResponse.json(conv)
  }),

  http.post("/api/conversations/:id/resolve", ({ params }) => {
    const conv = conversations.find((c) => c.id === params.id)
    if (!conv) return new HttpResponse(null, { status: 404 })
    conv.status = "Closed"
    conv.assignedAgentId = null
    conv.assignedAgentName = null
    return HttpResponse.json(conv)
  }),

  http.post("/api/conversations/:id/reopen", ({ params }) => {
    const conv = conversations.find((c) => c.id === params.id)
    if (!conv) return new HttpResponse(null, { status: 404 })
    conv.status = "Bot"
    return HttpResponse.json(conv)
  }),

  http.post("/api/conversations/:id/messages", async ({ params, request }) => {
    const body = (await request.json()) as { content: string }
    const newMsg: MessageDto = {
      id: `msg-${Date.now()}`,
      direction: "Outbound",
      author: "Agent",
      content: body.content,
      deliveryStatus: "sent",
      createdAt: new Date().toISOString(),
    }
    if (!messages[params.id as string]) messages[params.id as string] = []
    messages[params.id as string].push(newMsg)

    const conv = conversations.find((c) => c.id === params.id)
    if (conv) {
      conv.lastMessageSnippet = body.content
      conv.lastMessageAt = newMsg.createdAt
    }

    return HttpResponse.json(newMsg, { status: 201 })
  }),

  http.get("/api/tenant-profile", () => HttpResponse.json(tenantProfile)),

  http.put("/api/tenant-profile", async ({ request }) => {
    const body = (await request.json()) as TenantProfile
    Object.assign(tenantProfile, body)
    return HttpResponse.json(tenantProfile)
  }),

  http.get("/api/knowledge", () => HttpResponse.json(knowledgeDocs)),

  http.post("/api/knowledge/upload", () => {
    const newDoc: KnowledgeDoc = {
      id: `doc-${Date.now()}`,
      tenantId: "tenant-1",
      filename: "Nuevo documento.pdf",
      docType: "pdf",
      status: "ready",
      chunkCount: 5,
      errorMessage: null,
      createdAt: new Date().toISOString(),
    }
    knowledgeDocs.push(newDoc)
    return HttpResponse.json({ message: "OK", docId: newDoc.id, chunkCount: 5 })
  }),

  http.post("/api/knowledge/text", async ({ request }) => {
    const body = (await request.json()) as { title: string; content: string }
    const newDoc: KnowledgeDoc = {
      id: `doc-${Date.now()}`,
      tenantId: "tenant-1",
      filename: body.title,
      docType: "text",
      status: "ready",
      chunkCount: 2,
      errorMessage: null,
      createdAt: new Date().toISOString(),
    }
    knowledgeDocs.push(newDoc)
    return HttpResponse.json({ message: "OK", docId: newDoc.id, chunkCount: 2 })
  }),

  http.delete("/api/knowledge/:id", ({ params }) => {
    const idx = knowledgeDocs.findIndex((d) => d.id === params.id)
    if (idx !== -1) knowledgeDocs.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  http.get("/api/me", () => HttpResponse.json(me)),
  http.post("/api/tenants", async ({ request }) => {
    const body = (await request.json()) as { name: string }
    me.tenant = { id: "tenant-1", name: body.name, plan: "Basic", status: "Active" }
    me.role = "Owner"
    return HttpResponse.json(me.tenant, { status: 201 })
  }),

  http.get("/api/memberships", () => HttpResponse.json(agents)),
  http.get("/api/memberships/invitations", () => HttpResponse.json(invitations)),
  http.post("/api/memberships/invite", async ({ request }) => {
    const body = (await request.json()) as { email: string }
    invitations.push({ id: `inv-${Date.now()}`, email: body.email, role: "Agent", createdAt: new Date().toISOString() })
    return new HttpResponse(null, { status: 204 })
  }),
  http.delete("/api/memberships/invitations/:id", ({ params }) => {
    const idx = invitations.findIndex((i) => i.id === params.id)
    if (idx !== -1) invitations.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),
  http.delete("/api/memberships/:id", ({ params }) => {
    const idx = agents.findIndex((a) => a.id === params.id)
    if (idx !== -1) agents.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  // Real Bot Simulation Endpoint
  http.post("/api/bot/simulate", async ({ request }) => {
    const body = (await request.json()) as BotSimulateRequest
    await new Promise((r) => setTimeout(r, 600))

    const isHumanRequest = body.userMessage.toLowerCase().includes("humano") ||
      body.userMessage.toLowerCase().includes("asesor") ||
      body.userMessage.toLowerCase().includes("reclamo")

    const res: BotSimulateResponse = {
      replyText: isHumanRequest
        ? "Te comunico con un asesor de nuestro equipo para continuar la conversación."
        : `[Respuesta Groq LPU] Respecto a tu consulta sobre "${body.userMessage}": Aceptamos múltiples medios de pago y hacemos envíos a todo el país.`,
      shouldHandoff: isHumanRequest,
      handoffReason: isHumanRequest ? "ExplicitHumanRequest" : null,
      inputTokens: 180,
      outputTokens: 32,
      retrievedChunks: [
        {
          chunkId: "chunk-1",
          docId: "doc-1",
          content: "Envíos a todo el país por Andreani y OCA. Costo: $4500 CABA, $6500 interior.",
          similarity: 0.88,
        },
        {
          chunkId: "chunk-2",
          docId: "doc-2",
          content: "Políticas de cambios y devoluciones: se aceptan hasta 30 días posteriores a la compra.",
          similarity: 0.76,
        },
      ],
    }

    return HttpResponse.json(res)
  }),
]
