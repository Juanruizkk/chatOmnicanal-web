import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { tenantProfileService } from "../services/tenantProfile"
import type { TenantProfile } from "../types/api.types"

export function useTenantProfile() {
  return useQuery({
    queryKey: ["tenant-profile"],
    queryFn: () => tenantProfileService.get(),
  })
}

export function useUpdateTenantProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<TenantProfile>) => tenantProfileService.update(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["tenant-profile"], updated)
    },
  })
}
