import { apiClient } from "../lib/apiClient"
import type { AgentMembership, PendingInvitation, UserRole } from "../types/api.types"

// Forma que devuelve la API (MembershipDto)
interface MembershipApiDto {
  id: string
  userId: string
  userEmail: string
  userName: string
  role: UserRole
}

export const agentsService = {
  list: async (): Promise<AgentMembership[]> => {
    const { data } = await apiClient.get<MembershipApiDto[]>("/api/memberships")
    return data.map((m) => ({
      id: m.id,
      userId: m.userId,
      role: m.role,
      user: { id: m.userId, email: m.userEmail, name: m.userName || m.userEmail },
    }))
  },

  listInvitations: async (): Promise<PendingInvitation[]> => {
    const { data } = await apiClient.get<PendingInvitation[]>("/api/memberships/invitations")
    return data
  },

  invite: async (email: string): Promise<void> => {
    await apiClient.post("/api/memberships/invite", { email })
  },

  remove: async (membershipId: string): Promise<void> => {
    await apiClient.delete(`/api/memberships/${membershipId}`)
  },

  revokeInvitation: async (invitationId: string): Promise<void> => {
    await apiClient.delete(`/api/memberships/invitations/${invitationId}`)
  },
}
