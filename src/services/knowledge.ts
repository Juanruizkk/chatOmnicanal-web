import { apiClient } from "../lib/apiClient"
import type { KnowledgeDoc } from "../types/api.types"

export async function getKnowledgeDocuments(): Promise<KnowledgeDoc[]> {
  const res = await apiClient.get<KnowledgeDoc[]>("/api/knowledge")
  return res.data
}

export async function uploadKnowledgeFile(
  file: File
): Promise<{ message: string; docId: string; chunkCount: number }> {
  const formData = new FormData()
  formData.append("file", file)

  const res = await apiClient.post<{ message: string; docId: string; chunkCount: number }>(
    "/api/knowledge/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )
  return res.data
}

export async function createKnowledgeText(
  title: string,
  content: string
): Promise<{ message: string; docId: string; chunkCount: number }> {
  const res = await apiClient.post<{ message: string; docId: string; chunkCount: number }>(
    "/api/knowledge/text",
    { title, content }
  )
  return res.data
}

export async function deleteKnowledgeDocument(docId: string): Promise<void> {
  await apiClient.delete(`/api/knowledge/${docId}`)
}
