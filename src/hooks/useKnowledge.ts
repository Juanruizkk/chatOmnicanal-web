import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getKnowledgeDocuments,
  uploadKnowledgeFile,
  createKnowledgeText,
  deleteKnowledgeDocument,
} from "../services/knowledge"

export function useKnowledgeDocuments() {
  return useQuery({
    queryKey: ["knowledge-documents"],
    queryFn: () => getKnowledgeDocuments(),
  })
}

export function useUploadKnowledgeFile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => uploadKnowledgeFile(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-documents"] })
    },
  })
}

export function useCreateKnowledgeText() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ title, content }: { title: string; content: string }) =>
      createKnowledgeText(title, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-documents"] })
    },
  })
}

export function useDeleteKnowledgeDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (docId: string) => deleteKnowledgeDocument(docId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-documents"] })
    },
  })
}
