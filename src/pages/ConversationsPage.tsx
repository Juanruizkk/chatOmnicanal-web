import { Outlet, useMatch } from "react-router-dom"
import { ConversationList } from "../components/conversations/ConversationList"

export function ConversationsPage() {
  const hasChat = useMatch("/conversations/:id")

  return (
    <div className="flex h-full w-full">
      <ConversationList />
      {!hasChat && (
        <div className="flex flex-1 items-center justify-center text-muted-foreground text-sm">
          Seleccioná una conversación
        </div>
      )}
      <Outlet />
    </div>
  )
}
