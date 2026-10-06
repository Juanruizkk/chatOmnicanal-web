import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getTenantProfile, updateTenantProfile } from "../services/tenantProfile"
import type { TenantProfile } from "../types/api.types"

export function useTenantProfile() {
  return useQuery({
    queryKey: ["tenant-profile"],
    queryFn: () => getTenantProfile(),
  })
}

export function useUpdateTenantProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TenantProfile) => updateTenantProfile(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["tenant-profile"], updated)
      queryClient.invalidateQueries({ queryKey: ["tenant-profile"] })
    },
  })
}
