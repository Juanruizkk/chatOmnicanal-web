import { apiClient } from "../lib/apiClient"
import type { MeDto, TenantDto } from "../types/api.types"

export async function getMe(): Promise<MeDto> {
  const res = await apiClient.get<MeDto>("/api/me")
  return res.data
}

export async function createTenant(name: string): Promise<TenantDto> {
  const res = await apiClient.post<TenantDto>("/api/tenants", { name })
  return res.data
}
