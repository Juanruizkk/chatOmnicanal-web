import { apiClient } from "../lib/apiClient"
import type { TenantProfile } from "../types/api.types"

export async function getTenantProfile(): Promise<TenantProfile | null> {
  const res = await apiClient.get<TenantProfile>("/api/tenant-profile")
  return res.data
}

export async function updateTenantProfile(data: TenantProfile): Promise<TenantProfile> {
  const res = await apiClient.put<TenantProfile>("/api/tenant-profile", data)
  return res.data
}
