import { useMutation } from "@tanstack/react-query"
import { simulateBot } from "../services/simulation"
import type { BotSimulateRequest } from "../types/api.types"

export function useBotSimulation() {
  return useMutation({
    mutationFn: (request: BotSimulateRequest) => simulateBot(request),
  })
}
