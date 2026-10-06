import { useParams } from "react-router-dom"
import { ChatView } from "../components/chat/ChatView"

export function ChatPage() {
  const { id } = useParams<{ id: string }>()
  if (!id) return null
  return <ChatView conversationId={id} />
}
