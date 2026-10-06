import { DocumentUpload } from "../components/settings/DocumentUpload"
import { DocumentsList } from "../components/settings/DocumentsList"

export function SettingsDocumentsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h1 className="text-lg font-semibold mb-2">Documentos del negocio</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Subí catálogos, políticas de cambio o FAQ. El bot los usa para responder.
      </p>
      <div className="space-y-4 max-w-lg">
        <DocumentUpload />
        <DocumentsList />
      </div>
    </div>
  )
}
