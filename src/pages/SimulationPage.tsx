import { BotSimulationChat } from "../components/simulation/BotSimulationChat"

export function SimulationPage() {
  return (
    <div className="flex flex-1 flex-col h-full p-6">
      <h1 className="text-lg font-semibold mb-4">Simulación del bot</h1>
      <div className="flex-1 overflow-hidden">
        <BotSimulationChat />
      </div>
    </div>
  )
}
