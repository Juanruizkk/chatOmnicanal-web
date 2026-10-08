// src/services/admin.ts
import { apiClient } from "../lib/apiClient"
import type {
  AuditLogEntryDto,
  BillingInfoDto,
  LlmPricingDto,
  PagedResult,
  PaymentDto,
  RegisterPaymentRequest,
  TenantAdminDto,
  TenantKpiDto,
  TenantStatsDto,
  UpdateTenantConfigRequest,
  AdminTenantsFilters,
} from "../types/api.types"

const BASE = "/api/admin"

export const adminApi = {
  listTenants: (filters: AdminTenantsFilters = {}) => {
    const params = new URLSearchParams()
    if (filters.search) params.set("search", filters.search)
    if (filters.status) params.set("status", filters.status)
    if (filters.plan) params.set("plan", filters.plan)
    params.set("page", String(filters.page ?? 1))
    params.set("pageSize", String(filters.pageSize ?? 20))
    return apiClient
      .get<PagedResult<TenantAdminDto>>(`${BASE}/tenants?${params}`)
      .then((r) => r.data)
  },

  getKpi: () =>
    apiClient.get<TenantKpiDto>(`${BASE}/tenants/kpi`).then((r) => r.data),

  exportCsv: (filters: AdminTenantsFilters = {}) => {
    const params = new URLSearchParams()
    if (filters.search) params.set("search", filters.search)
    if (filters.status) params.set("status", filters.status)
    if (filters.plan) params.set("plan", filters.plan)
    return apiClient
      .get(`${BASE}/tenants/export?${params}`, { responseType: "blob" })
      .then((r) => r.data as Blob)
  },

  getTenant: (tenantId: string) =>
    apiClient
      .get<TenantAdminDto>(`${BASE}/tenants/${tenantId}`)
      .then((r) => r.data),

  getTenantStats: (tenantId: string) =>
    apiClient
      .get<TenantStatsDto>(`${BASE}/tenants/${tenantId}/stats`)
      .then((r) => r.data),

  updateTenantConfig: (tenantId: string, data: UpdateTenantConfigRequest) =>
    apiClient
      .put(`${BASE}/tenants/${tenantId}/config`, data)
      .then((r) => r.data),

  getBillingInfo: (tenantId: string) =>
    apiClient
      .get<BillingInfoDto>(`${BASE}/tenants/${tenantId}/billing`)
      .then((r) => r.data),

  upsertBillingInfo: (tenantId: string, data: BillingInfoDto) =>
    apiClient
      .put(`${BASE}/tenants/${tenantId}/billing`, data)
      .then((r) => r.data),

  getPayments: (tenantId: string) =>
    apiClient
      .get<PaymentDto[]>(`${BASE}/tenants/${tenantId}/payments`)
      .then((r) => r.data),

  registerPayment: (tenantId: string, data: RegisterPaymentRequest) =>
    apiClient
      .post<PaymentDto>(`${BASE}/tenants/${tenantId}/payments`, data)
      .then((r) => r.data),

  deletePayment: (tenantId: string, paymentId: string) =>
    apiClient
      .delete(`${BASE}/tenants/${tenantId}/payments/${paymentId}`)
      .then((r) => r.data),

  getLlmPricings: () =>
    apiClient
      .get<LlmPricingDto[]>(`${BASE}/settings/llm-pricing`)
      .then((r) => r.data),

  upsertLlmPricing: (data: LlmPricingDto) =>
    apiClient
      .put(`${BASE}/settings/llm-pricing`, data)
      .then((r) => r.data),

  deleteLlmPricing: (pricingId: string) =>
    apiClient
      .delete(`${BASE}/settings/llm-pricing/${pricingId}`)
      .then((r) => r.data),

  getAuditLog: (params: {
    tenantId?: string
    action?: string
    from?: string
    to?: string
    page?: number
    pageSize?: number
  } = {}) => {
    const p = new URLSearchParams()
    if (params.tenantId) p.set("tenantId", params.tenantId)
    if (params.action) p.set("action", params.action)
    if (params.from) p.set("from", params.from)
    if (params.to) p.set("to", params.to)
    p.set("page", String(params.page ?? 1))
    p.set("pageSize", String(params.pageSize ?? 50))
    return apiClient
      .get<PagedResult<AuditLogEntryDto>>(`${BASE}/audit-log?${p}`)
      .then((r) => r.data)
  },
}
