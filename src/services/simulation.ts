import { apiClient } from "../lib/apiClient"
import type { BotSimulateRequest, BotSimulateResponse } from "../types/api.types"

export async function simulateBot(
  request: BotSimulateRequest
): Promise<BotSimulateResponse> {
  const res = await apiClient.post<BotSimulateResponse>(
    "/api/bot/simulate",
    request
  )
  return res.data
}
