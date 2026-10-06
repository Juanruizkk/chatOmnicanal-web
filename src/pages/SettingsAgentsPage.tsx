import { AgentsList } from "../components/settings/AgentsList"
import { InviteAgentModal } from "../components/settings/InviteAgentModal"

export function SettingsAgentsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6 max-w-lg">
        <h1 className="text-lg font-semibold">Agentes</h1>
        <InviteAgentModal />
      </div>
      <div className="max-w-lg">
        <AgentsList />
      </div>
    </div>
  )
}
