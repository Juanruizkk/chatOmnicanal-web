// src/hooks/useAdmin.ts
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { adminApi } from "../services/admin"
import type {
  AdminTenantsFilters,
  BillingInfoDto,
  LlmPricingDto,
  RegisterPaymentRequest,
  UpdateTenantConfigRequest,
} from "../types/api.types"

// ── Tenants list ────────────────────────────────────────────────────────────

export function useAdminTenants(filters: AdminTenantsFilters = {}) {
  return useQuery({
    queryKey: ["admin", "tenants", filters],
    queryFn: () => adminApi.listTenants(filters),
    staleTime: 30_000,
  })
}

export function useAdminKpi() {
  return useQuery({
    queryKey: ["admin", "kpi"],
    queryFn: adminApi.getKpi,
    staleTime: 60_000,
  })
}

// ── Tenant detail ───────────────────────────────────────────────────────────

export function useAdminTenant(tenantId: string) {
  return useQuery({
    queryKey: ["admin", "tenants", tenantId],
    queryFn: () => adminApi.getTenant(tenantId),
    enabled: !!tenantId,
  })
}

export function useAdminTenantStats(tenantId: string) {
  return useQuery({
    queryKey: ["admin", "tenants", tenantId, "stats"],
    queryFn: () => adminApi.getTenantStats(tenantId),
    enabled: !!tenantId,
  })
}

export function useUpdateTenantConfig(tenantId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateTenantConfigRequest) =>
      adminApi.updateTenantConfig(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "tenants"] })
    },
  })
}

// ── Billing ─────────────────────────────────────────────────────────────────

export function useAdminBillingInfo(tenantId: string) {
  return useQuery({
    queryKey: ["admin", "tenants", tenantId, "billing"],
    queryFn: () => adminApi.getBillingInfo(tenantId),
    enabled: !!tenantId,
  })
}

export function useUpsertBillingInfo(tenantId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: BillingInfoDto) =>
      adminApi.upsertBillingInfo(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "tenants", tenantId, "billing"] })
    },
  })
}

// ── Payments ────────────────────────────────────────────────────────────────

export function useAdminPayments(tenantId: string) {
  return useQuery({
    queryKey: ["admin", "tenants", tenantId, "payments"],
    queryFn: () => adminApi.getPayments(tenantId),
    enabled: !!tenantId,
  })
}

export function useRegisterPayment(tenantId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: RegisterPaymentRequest) =>
      adminApi.registerPayment(tenantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "tenants", tenantId, "payments"] })
      qc.invalidateQueries({ queryKey: ["admin", "tenants"] })
    },
  })
}

export function useDeletePayment(tenantId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (paymentId: string) => adminApi.deletePayment(tenantId, paymentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "tenants", tenantId, "payments"] })
    },
  })
}

// ── LLM Pricing ─────────────────────────────────────────────────────────────

export function useLlmPricings() {
  return useQuery({
    queryKey: ["admin", "llm-pricing"],
    queryFn: adminApi.getLlmPricings,
  })
}

export function useUpsertLlmPricing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: LlmPricingDto) => adminApi.upsertLlmPricing(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "llm-pricing"] })
    },
  })
}

export function useDeleteLlmPricing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (pricingId: string) => adminApi.deleteLlmPricing(pricingId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "llm-pricing"] })
    },
  })
}

// ── Audit log ───────────────────────────────────────────────────────────────

export function useAdminAuditLog(params: {
  tenantId?: string
  action?: string
  from?: string
  to?: string
  page?: number
  pageSize?: number
} = {}) {
  return useQuery({
    queryKey: ["admin", "audit-log", params],
    queryFn: () => adminApi.getAuditLog(params),
    staleTime: 30_000,
  })
}
