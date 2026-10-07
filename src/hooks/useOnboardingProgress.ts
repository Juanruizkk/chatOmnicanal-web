import { useState, useEffect, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { useMe } from "./useMe"
import { useTenantProfile } from "./useTenantProfile"
import { useKnowledgeDocuments } from "./useKnowledge"
import { agentsService } from "../services/agents"
import { Store, Settings, FileText, Bot, Users } from "lucide-react"

export interface OnboardingStep {
  id: string
  title: string
  description: string
  completed: boolean
  route: string
  actionLabel: string
  icon: React.ElementType
}

export function useOnboardingProgress() {
  const { data: me } = useMe()
  const { data: profile } = useTenantProfile()
  const { data: documents } = useKnowledgeDocuments()

  const { data: agents } = useQuery({
    queryKey: ["agents"],
    queryFn: () => agentsService.list(),
    enabled: !!me?.tenant,
  })

  const { data: invitations } = useQuery({
    queryKey: ["agents", "invitations"],
    queryFn: () => agentsService.listInvitations(),
    enabled: !!me?.tenant,
  })

  const tenantId = me?.tenant?.id || "default"
  const simKey = `bot_simulated_${tenantId}`

  const [isSimulated, setIsSimulated] = useState(() => {
    return localStorage.getItem(simKey) === "true"
  })

  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem(`onboarding_dismissed_${tenantId}`) === "true"
  })

  // Listen to custom event or storage updates when simulation runs
  useEffect(() => {
    const handleStorage = () => {
      setIsSimulated(localStorage.getItem(simKey) === "true")
    }
    window.addEventListener("storage", handleStorage)
    window.addEventListener("bot-simulated", handleStorage)
    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("bot-simulated", handleStorage)
    }
  }, [simKey])

  const setDismissed = useCallback((dismissed: boolean) => {
    setIsDismissed(dismissed)
    localStorage.setItem(`onboarding_dismissed_${tenantId}`, dismissed ? "true" : "false")
  }, [tenantId])

  const markSimulated = useCallback(() => {
    localStorage.setItem(simKey, "true")
    setIsSimulated(true)
    window.dispatchEvent(new Event("bot-simulated"))
  }, [simKey])

  // Step 1: Tenant created
  const hasTenant = Boolean(me?.tenant?.id)

  // Step 2: Profile configured (tone, address, shipping or contact info)
  const hasProfile = Boolean(
    profile &&
      (profile.tone?.trim() ||
        profile.address?.trim() ||
        profile.shippingInfo?.trim() ||
        profile.paymentMethods?.trim() ||
        profile.contactPhone?.trim())
  )

  // Step 3: Documents uploaded
  const hasDocs = Boolean(documents && documents.length > 0)

  // Step 4: Bot tested in simulation
  const hasSimulated = isSimulated

  // Step 5: Agents invited or team members
  const hasAgents = Boolean(
    (agents && agents.length > 1) || (invitations && invitations.length > 0)
  )

  const steps: OnboardingStep[] = [
    {
      id: "tenant",
      title: "Crear tu espacio de negocio",
      description: `Negocio "${me?.tenant?.name || 'Mi tienda'}" registrado y activo.`,
      completed: hasTenant,
      route: "/conversations",
      actionLabel: "Ver negocio",
      icon: Store,
    },
    {
      id: "profile",
      title: "Configurar tono y datos del negocio",
      description: "Definí la personalidad del bot, horarios de atención y políticas comerciales.",
      completed: hasProfile,
      route: "/settings/profile",
      actionLabel: hasProfile ? "Editar perfil" : "Configurar perfil",
      icon: Settings,
    },
    {
      id: "knowledge",
      title: "Entrenar al bot con conocimiento (RAG)",
      description: "Subí documentos PDF o textos con tu catálogo, precios o preguntas frecuentes.",
      completed: hasDocs,
      route: "/settings/documents",
      actionLabel: hasDocs ? "Ver documentos" : "Subir documentos",
      icon: FileText,
    },
    {
      id: "simulation",
      title: "Probar tu bot en el Simulador",
      description: "Hacé una consulta de prueba para verificar cómo responde y cuándo deriva a humanos.",
      completed: hasSimulated,
      route: "/simulation",
      actionLabel: hasSimulated ? "Volver a probar" : "Probar simulador",
      icon: Bot,
    },
    {
      id: "agents",
      title: "Invitar a tu equipo de agentes",
      description: "Sumá compañeros para que atiendan las consultas derivadas por el bot.",
      completed: hasAgents,
      route: "/settings/agents",
      actionLabel: hasAgents ? "Ver equipo" : "Invitar colega",
      icon: Users,
    },
  ]

  const completedCount = steps.filter((s) => s.completed).length
  const totalCount = steps.length
  const percent = Math.round((completedCount / totalCount) * 100)
  const isAllCompleted = completedCount === totalCount

  return {
    steps,
    completedCount,
    totalCount,
    percent,
    isAllCompleted,
    isDismissed,
    setDismissed,
    markSimulated,
    tenantName: me?.tenant?.name || "tu negocio",
  }
}
