import { useKnowledgeDocuments, useDeleteKnowledgeDocument } from "../../hooks/useKnowledge"
import { Button } from "../ui/button"
import { FileText, Trash2, CheckCircle2, Clock, AlertCircle } from "lucide-react"

export function DocumentsList() {
  const { data: docs, isLoading } = useKnowledgeDocuments()
  const { mutate: deleteDoc, isPending: isDeleting } = useDeleteKnowledgeDocument()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!docs || docs.length === 0) {
    return (
      <div className="border border-dashed rounded-xl p-8 text-center bg-muted/10">
        <FileText className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
        <p className="text-sm font-medium text-muted-foreground">
          No hay documentos en la base de conocimiento
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Subí manuales en PDF, archivos de texto o preguntas frecuentes para que el bot aprenda sobre tu negocio.
        </p>
      </div>
    )
  }

  return (
    <div className="border rounded-xl divide-y overflow-hidden shadow-sm">
      {docs.map((doc) => {
        const isReady = doc.status === "ready"
        const isProcessing = doc.status === "processing"
        const isError = doc.status === "failed"

        return (
          <div
            key={doc.id}
            className="flex items-center justify-between p-3.5 hover:bg-muted/30 transition-colors gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <FileText className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold truncate text-foreground">
                  {doc.filename}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{doc.chunkCount} fragmentos (chunks)</span>
                  <span>·</span>
                  <span>{new Date(doc.createdAt).toLocaleDateString("es-AR")}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Status Indicator */}
              <div className="flex items-center gap-1.5 text-xs">
                {isReady && (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Listo
                  </span>
                )}
                {isProcessing && (
                  <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                    <Clock className="h-3.5 w-3.5 animate-spin" />
                    Indexando...
                  </span>
                )}
                {isError && (
                  <span className="inline-flex items-center gap-1 text-destructive font-medium">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Error
                  </span>
                )}
              </div>

              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={() => deleteDoc(doc.id)}
                disabled={isDeleting}
                title="Eliminar documento"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
