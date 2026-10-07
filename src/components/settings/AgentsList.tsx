import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { agentsService } from "../../services/agents"
import { Button } from "../ui/button"
import { Mail, Trash2 } from "lucide-react"

export function AgentsList() {
  const queryClient = useQueryClient()

  const { data: agents, isLoading } = useQuery({
    queryKey: ["agents"],
    queryFn: () => agentsService.list(),
  })

  const { data: invitations } = useQuery({
    queryKey: ["agents", "invitations"],
    queryFn: () => agentsService.listInvitations(),
  })

  const removeMutation = useMutation({
    mutationFn: (id: string) => agentsService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["agents"] }),
  })

  const revokeMutation = useMutation({
    mutationFn: (id: string) => agentsService.revokeInvitation(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["agents", "invitations"] }),
  })

  if (isLoading) return <div className="text-sm text-muted-foreground">Cargando…</div>

  return (
    <ul className="space-y-2">
      {agents?.map(agent => (
        <li key={agent.id} className="flex items-center gap-3 rounded-lg border p-3">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium shrink-0">
            {agent.user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{agent.user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{agent.user.email}</p>
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            {agent.role === "Owner" ? "Dueño" : "Agente"}
          </span>
          {agent.role !== "Owner" && (
            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground hover:text-destructive shrink-0"
              onClick={() => removeMutation.mutate(agent.id)}
              disabled={removeMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </li>
      ))}
      {invitations?.map(invitation => (
        <li key={invitation.id} className="flex items-center gap-3 rounded-lg border border-dashed p-3">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
            <Mail className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{invitation.email}</p>
            <p className="text-xs text-muted-foreground truncate">Esperando que se registre</p>
          </div>
          <span className="text-xs text-muted-foreground shrink-0">Pendiente</span>
          <Button
            size="icon"
            variant="ghost"
            title="Cancelar invitación"
            className="text-muted-foreground hover:text-destructive shrink-0"
            onClick={() => revokeMutation.mutate(invitation.id)}
            disabled={revokeMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ul>
  )
}
