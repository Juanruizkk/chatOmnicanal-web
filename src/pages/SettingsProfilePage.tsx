import { BusinessProfileForm } from "../components/settings/BusinessProfileForm"

export function SettingsProfilePage() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h1 className="text-lg font-semibold mb-6">Perfil del negocio</h1>
      <BusinessProfileForm />
    </div>
  )
}
