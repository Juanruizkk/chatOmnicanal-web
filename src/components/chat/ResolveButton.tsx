import { Button } from "../ui/button"
import { useResolve } from "../../hooks/useConversations"
import { CheckCircle } from "lucide-react"

export function ResolveButton({ conversationId }: { conversationId: string }) {
  const { mutate, isPending } = useResolve(conversationId)

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => mutate()}
      disabled={isPending}
    >
      <CheckCircle className="h-4 w-4 mr-1" />
      {isPending ? "Resolviendo..." : "Resolver"}
    </Button>
  )
}
