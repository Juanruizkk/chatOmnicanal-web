import { Button } from "../ui/button"
import { useTakeControl } from "../../hooks/useConversations"
import { UserCheck } from "lucide-react"

export function TakeControlButton({ conversationId }: { conversationId: string }) {
  const { mutate, isPending } = useTakeControl(conversationId)

  return (
    <Button
      size="sm"
      onClick={() => mutate()}
      disabled={isPending}
    >
      <UserCheck className="h-4 w-4 mr-1" />
      {isPending ? "Tomando control..." : "Tomar control"}
    </Button>
  )
}
