import { Button } from "../ui/button"
import { useReopen } from "../../hooks/useConversations"
import { RotateCcw } from "lucide-react"

export function ReopenButton({ conversationId }: { conversationId: string }) {
  const { mutate, isPending } = useReopen(conversationId)

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => mutate()}
      disabled={isPending}
    >
      <RotateCcw className="h-4 w-4 mr-1" />
      {isPending ? "Reabriendo..." : "Reabrir conversación"}
    </Button>
  )
}
