import { useRef } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { documentsService } from "../../services/documents"
import { Button } from "../ui/button"
import { Upload } from "lucide-react"

export function DocumentUpload() {
  const queryClient = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)

  const { mutate, isPending } = useMutation({
    mutationFn: (file: File) => documentsService.upload(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents"] }),
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) mutate(file)
    e.target.value = ""
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt"
        className="hidden"
        onChange={handleChange}
      />
      <Button
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
      >
        <Upload className="h-4 w-4 mr-2" />
        {isPending ? "Subiendo…" : "Subir documento (PDF o TXT)"}
      </Button>
    </div>
  )
}
