import { http, HttpResponse } from "msw"
import type {
  Conversation, Message, TenantProfile, KnowledgeDoc, AgentMembership
} from "../types/api.types"

const conversations: Conversation[] = [
  {
    id: "conv-1",
    tenantId: "tenant-1",
    channelId: "ch-1",
    contactId: "ct-1",
    status: "Bot",
    assignedAgentId: null,
    lastUserMessageAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    referralJson: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    contact: { id: "ct-1", externalId: "5491112345678", name: "María López", channelType: "WhatsApp" },
    channel: { type: "WhatsApp" },
    lastMessage: {
      id: "msg-3",
      conversationId: "conv-1",
      direction: "Inbound",
      author: "User",
      content: "¿Hacen envíos a Rosario?",
      externalId: "wamid-3",
      deliveryStatus: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
  },
  {
    id: "conv-2",
    tenantId: "tenant-1",
    channelId: "ch-2",
    contactId: "ct-2",
    status: "Human",
    assignedAgentId: "user-1",
    lastUserMessageAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    referralJson: JSON.stringify({ headline: "Promo verano", source_id: "ad-123" }),
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    contact: { id: "ct-2", externalId: "igsid-789", name: "Carlos Ruiz", channelType: "Instagram" },
    channel: { type: "Instagram" },
    lastMessage: {
      id: "msg-7",
      conversationId: "conv-2",
      direction: "Inbound",
      author: "User",
      content: "Quiero hablar con alguien por favor",
      externalId: "ig-msg-7",
      deliveryStatus: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    },
  },
  {
    id: "conv-3",
    tenantId: "tenant-1",
    channelId: "ch-1",
    contactId: "ct-3",
    status: "InQueue",
    assignedAgentId: null,
    lastUserMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    referralJson: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    contact: { id: "ct-3", externalId: "5491187654321", name: "Ana Gómez", channelType: "WhatsApp" },
    channel: { type: "WhatsApp" },
    lastMessage: {
      id: "msg-10",
      conversationId: "conv-3",
      direction: "Outbound",
      author: "Bot",
      content: "Entendido, te responden mañana desde las 9hs.",
      externalId: "wamid-10",
      deliveryStatus: "delivered",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
  },
]

const messages: Record<string, Message[]> = {
  "conv-1": [
    {
      id: "msg-1",
      conversationId: "conv-1",
      direction: "Inbound",
      author: "User",
      content: "Hola, buenos días",
      externalId: "wamid-1",
      deliveryStatus: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: "msg-2",
      conversationId: "conv-1",
      direction: "Outbound",
      author: "Bot",
      content: "¡Hola! Bienvenido/a. ¿En qué te puedo ayudar?",
      externalId: "wamid-2",
      deliveryStatus: "read",
      createdAt: new Date(Date.now() - 1000 * 60 * 59).toISOString(),
    },
    {
      id: "msg-3",
      conversationId: "conv-1",
      direction: "Inbound",
      author: "User",
      content: "¿Hacen envíos a Rosario?",
      externalId: "wamid-3",
      deliveryStatus: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
  ],
  "conv-2": [
    {
      id: "msg-5",
      conversationId: "conv-2",
      direction: "Inbound",
      author: "User",
      content: "Buenas tardes, tengo una consulta sobre un pedido",
      externalId: "ig-msg-5",
      deliveryStatus: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "msg-6",
      conversationId: "conv-2",
      direction: "Outbound",
      author: "Bot",
      content: "¡Hola! Claro, contame qué necesitás.",
      externalId: "ig-msg-6",
      deliveryStatus: "read",
      createdAt: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
    },
    {
      id: "msg-7",
      conversationId: "conv-2",
      direction: "Inbound",
      author: "User",
      content: "Quiero hablar con alguien por favor",
      externalId: "ig-msg-7",
      deliveryStatus: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    },
  ],
  "conv-3": [
    {
      id: "msg-10",
      conversationId: "conv-3",
      direction: "Outbound",
      author: "Bot",
      content: "Entendido, te responden mañana desde las 9hs.",
      externalId: "wamid-10",
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
  tone: "amigable",
  businessHoursJson: JSON.stringify({
    monday: { open: "09:00", close: "18:00", closed: false },
    tuesday: { open: "09:00", close: "18:00", closed: false },
    wednesday: { open: "09:00", close: "18:00", closed: false },
    thursday: { open: "09:00", close: "18:00", closed: false },
    friday: { open: "09:00", close: "17:00", closed: false },
    saturday: { open: "10:00", close: "14:00", closed: false },
    sunday: { open: "00:00", close: "00:00", closed: true },
  }),
  shippingInfo: "Envíos a todo el país por Andreani y OCA. Costo: $2500 CABA, $3500 interior.",
  paymentMethods: "Efectivo, transferencia bancaria, MercadoPago, tarjetas de crédito y débito.",
}

const knowledgeDocs: KnowledgeDoc[] = [
  {
    id: "doc-1",
    tenantId: "tenant-1",
    name: "Catálogo temporada 2026.pdf",
    type: "pdf",
    status: "ready",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "doc-2",
    tenantId: "tenant-1",
    name: "Política de cambios y devoluciones.txt",
    type: "text",
    status: "ready",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
]

const agents: AgentMembership[] = [
  {
    id: "mem-1",
    userId: "user-1",
    role: "Owner",
    user: { id: "user-1", email: "juan@tienda.com", name: "Juan Ruiz" },
  },
  {
    id: "mem-2",
    userId: "user-2",
    role: "Agent",
    user: { id: "user-2", email: "sofia@tienda.com", name: "Sofía Martínez" },
  },
]

export const handlers = [
  http.get("/api/conversations", ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get("status")
    const channel = url.searchParams.get("channel")
    let result = [...conversations]
    if (status) result = result.filter(c => c.status === status)
    if (channel) result = result.filter(c => c.channel.type === channel)
    return HttpResponse.json({ items: result, total: result.length, page: 1, pageSize: 20 })
  }),

  http.get("/api/conversations/:id", ({ params }) => {
    const conv = conversations.find(c => c.id === params.id)
    if (!conv) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(conv)
  }),

  http.post("/api/conversations/:id/take-control", ({ params }) => {
    const conv = conversations.find(c => c.id === params.id)
    if (!conv) return new HttpResponse(null, { status: 404 })
    conv.status = "Human"
    conv.assignedAgentId = "user-1"
    return HttpResponse.json(conv)
  }),

  http.post("/api/conversations/:id/resolve", ({ params }) => {
    const conv = conversations.find(c => c.id === params.id)
    if (!conv) return new HttpResponse(null, { status: 404 })
    conv.status = "Closed"
    conv.assignedAgentId = null
    return HttpResponse.json(conv)
  }),

  http.get("/api/conversations/:id/messages", ({ params }) => {
    const msgs = messages[params.id as string] ?? []
    return HttpResponse.json({ items: msgs, total: msgs.length, page: 1, pageSize: 50 })
  }),

  http.post("/api/conversations/:id/messages", async ({ params, request }) => {
    const body = await request.json() as { content: string }
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: params.id as string,
      direction: "Outbound",
      author: "Agent",
      content: body.content,
      externalId: `local-${Date.now()}`,
      deliveryStatus: "sent",
      createdAt: new Date().toISOString(),
    }
    if (!messages[params.id as string]) messages[params.id as string] = []
    messages[params.id as string].push(newMsg)
    return HttpResponse.json(newMsg, { status: 201 })
  }),

  http.get("/api/tenant-profile", () => HttpResponse.json(tenantProfile)),

  http.put("/api/tenant-profile", async ({ request }) => {
    const body = await request.json() as Partial<TenantProfile>
    Object.assign(tenantProfile, body)
    return HttpResponse.json(tenantProfile)
  }),

  http.get("/api/documents", () => HttpResponse.json(knowledgeDocs)),

  http.post("/api/documents", () => {
    const newDoc: KnowledgeDoc = {
      id: `doc-${Date.now()}`,
      tenantId: "tenant-1",
      name: "Nuevo documento.pdf",
      type: "pdf",
      status: "processing",
      createdAt: new Date().toISOString(),
    }
    knowledgeDocs.push(newDoc)
    return HttpResponse.json(newDoc, { status: 201 })
  }),

  http.delete("/api/documents/:id", ({ params }) => {
    const idx = knowledgeDocs.findIndex(d => d.id === params.id)
    if (idx !== -1) knowledgeDocs.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  http.get("/api/agents", () => HttpResponse.json(agents)),

  http.post("/api/agents/invite", () => new HttpResponse(null, { status: 204 })),

  http.delete("/api/agents/:id", ({ params }) => {
    const idx = agents.findIndex(a => a.id === params.id)
    if (idx !== -1) agents.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  // Bot simulation
  http.post("/api/simulation/message", async ({ request }) => {
    const { content } = await request.json() as { content: string }
    await new Promise(r => setTimeout(r, 800))
    return HttpResponse.json({
      id: `sim-${Date.now()}`,
      content: `[Bot simulado] Recibí: "${content}". Respondería con información del negocio.`,
      createdAt: new Date().toISOString(),
    })
  }),
]
