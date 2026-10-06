import { apiClient } from "../lib/apiClient"
import type { AgentMembership } from "../types/api.types"

export const agentsService = {
  list: async (): Promise<AgentMembership[]> => {
    const { data } = await apiClient.get("/api/agents")
    return data
  },

  invite: async (email: string): Promise<void> => {
    await apiClient.post("/api/agents/invite", { email })
  },

  remove: async (membershipId: string): Promise<void> => {
    await apiClient.delete(`/api/agents/${membershipId}`)
  },
}
