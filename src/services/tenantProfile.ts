import { apiClient } from "../lib/apiClient"
import type { TenantProfile } from "../types/api.types"

export const tenantProfileService = {
  get: async (): Promise<TenantProfile> => {
    const { data } = await apiClient.get("/api/tenant-profile")
    return data
  },

  update: async (body: Partial<TenantProfile>): Promise<TenantProfile> => {
    const { data } = await apiClient.put("/api/tenant-profile", body)
    return data
  },
}
