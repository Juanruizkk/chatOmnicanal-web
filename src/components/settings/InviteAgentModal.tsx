import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { agentsService } from "../../services/agents"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "../ui/dialog"
import { UserPlus } from "lucide-react"

export function InviteAgentModal() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const queryClient = useQueryClient()

  const { mutate, isPending, isError, reset } = useMutation({
    mutationFn: (e: string) => agentsService.invite(e),
    onSuccess: () => {
      setOpen(false)
      setEmail("")
      queryClient.invalidateQueries({ queryKey: ["agents"] })
    },
  })

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset() }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="h-4 w-4 mr-2" />
          Invitar agente
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invitar agente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="agente@tienda.com"
              onKeyDown={e => e.key === "Enter" && mutate(email)}
            />
          </div>
          {isError && (
            <p className="text-sm text-destructive">No se pudo enviar la invitación. Revisá el email e intentá de nuevo.</p>
          )}
          <Button
            className="w-full"
            onClick={() => mutate(email)}
            disabled={!email || isPending}
          >
            {isPending ? "Enviando invitación…" : "Enviar invitación"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
