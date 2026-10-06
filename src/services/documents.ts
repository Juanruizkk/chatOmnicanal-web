import { apiClient } from "../lib/apiClient"
import type { KnowledgeDoc } from "../types/api.types"

export const documentsService = {
  list: async (): Promise<KnowledgeDoc[]> => {
    const { data } = await apiClient.get("/api/documents")
    return data
  },

  upload: async (file: File): Promise<KnowledgeDoc> => {
    const form = new FormData()
    form.append("file", file)
    const { data } = await apiClient.post("/api/documents", form)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/documents/${id}`)
  },
}
