// src/store/adminStore.ts
import { create } from "zustand"
import type { AdminTenantsFilters } from "../types/api.types"

interface AdminStore {
  tenantsFilters: AdminTenantsFilters
  setTenantsFilters: (f: Partial<AdminTenantsFilters>) => void
  resetTenantsFilters: () => void
}

const DEFAULT_FILTERS: AdminTenantsFilters = {
  search: "",
  status: undefined,
  plan: undefined,
  page: 1,
  pageSize: 20,
}

export const useAdminStore = create<AdminStore>((set) => ({
  tenantsFilters: DEFAULT_FILTERS,
  setTenantsFilters: (f) =>
    set((s) => ({
      tenantsFilters: { ...s.tenantsFilters, ...f, page: f.page ?? 1 },
    })),
  resetTenantsFilters: () => set({ tenantsFilters: DEFAULT_FILTERS }),
}))
