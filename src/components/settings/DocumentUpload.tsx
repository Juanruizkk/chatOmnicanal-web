import { useRef, useState } from "react"
import { useUploadKnowledgeFile, useCreateKnowledgeText } from "../../hooks/useKnowledge"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Upload, Plus, FileText } from "lucide-react"

export function DocumentUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { mutate: uploadFile, isPending: isUploading } = useUploadKnowledgeFile()
  const { mutate: createText, isPending: isCreatingText } = useCreateKnowledgeText()

  const [isTextModalOpen, setIsTextModalOpen] = useState(false)
  const [textTitle, setTextTitle] = useState("")
  const [textContent, setTextContent] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadFile(file)
    }
    e.target.value = ""
  }

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!textTitle.trim() || !textContent.trim()) return

    createText(
      { title: textTitle.trim(), content: textContent.trim() },
      {
        onSuccess: () => {
          setTextTitle("")
          setTextContent("")
          setIsTextModalOpen(false)
        },
      }
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.md"
          className="hidden"
          onChange={handleFileChange}
        />

        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? "Indexando documento..." : "Subir archivo (PDF o TXT)"}
        </Button>

        <Button
          variant="secondary"
          onClick={() => setIsTextModalOpen(!isTextModalOpen)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Agregar FAQ o Texto Directo
        </Button>
      </div>

      {/* Direct text ingestion form */}
      {isTextModalOpen && (
        <form
          onSubmit={handleTextSubmit}
          className="border rounded-xl p-4 bg-muted/20 space-y-3 mt-3 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center gap-2 pb-2 border-b">
            <FileText className="h-4 w-4 text-primary" />
            <h4 className="font-semibold text-sm">Nuevo Fragmento de Conocimiento / FAQ</h4>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Título o Pregunta</Label>
            <Input
              value={textTitle}
              onChange={(e) => setTextTitle(e.target.value)}
              placeholder="Ej: Política de Devoluciones y Garantía"
              className="text-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Contenido detallado para el RAG</Label>
            <Textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Escribí aquí las respuestas detalladas, condiciones, excepciones o instrucciones..."
              rows={4}
              className="text-sm resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsTextModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isCreatingText || !textTitle.trim() || !textContent.trim()}
            >
              {isCreatingText ? "Guardando e indexando..." : "Guardar e Indexar"}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
