import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { documentsService } from "../../services/documents"
import { Button } from "../ui/button"
import { FileText, Trash2 } from "lucide-react"

const statusLabel: Record<string, string> = {
  pending: "Pendiente",
  processing: "Procesando…",
  ready: "Listo",
  error: "Error",
}

const statusColor: Record<string, string> = {
  pending: "text-yellow-600",
  processing: "text-blue-600",
  ready: "text-green-600",
  error: "text-destructive",
}

export function DocumentsList() {
  const queryClient = useQueryClient()
  const { data: docs, isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: () => documentsService.list(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => documentsService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents"] }),
  })

  if (isLoading) return <div className="text-sm text-muted-foreground">Cargando…</div>

  if (!docs?.length) return <p className="text-sm text-muted-foreground">No hay documentos subidos.</p>

  return (
    <ul className="space-y-2">
      {docs.map(doc => (
        <li key={doc.id} className="flex items-center gap-3 rounded-lg border p-3">
          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{doc.name}</p>
            <p className={`text-xs ${statusColor[doc.status]}`}>{statusLabel[doc.status]}</p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => deleteMutation.mutate(doc.id)}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ul>
  )
}
