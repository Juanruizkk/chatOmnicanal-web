import { useState } from "react"
import {
  useChannelsOverview,
  useConnectWhatsApp,
  useConnectInstagram,
  useConnectMessenger,
  useDisconnectChannel,
} from "../hooks/useChannels"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Badge } from "../components/ui/badge"
import {
  Radio,
  Check,
  Copy,
  ExternalLink,
  Smartphone,
  Trash2,
  AlertCircle,
  HelpCircle,
  KeyRound,
  Globe,
} from "lucide-react"

export function SettingsChannelsPage() {
  const { data: overview, isLoading, isError } = useChannelsOverview()
  const { mutateAsync: connectWA, isPending: isWAPending } = useConnectWhatsApp()
  const { mutateAsync: connectIG, isPending: isIGPending } = useConnectInstagram()
  const { mutateAsync: connectFB, isPending: isFBPending } = useConnectMessenger()
  const { mutateAsync: disconnect, isPending: isDisconnectPending } = useDisconnectChannel()

  // WhatsApp Form
  const [waPhoneId, setWaPhoneId] = useState("")
  const [waWabaId, setWaWabaId] = useState("")
  const [waToken, setWaToken] = useState("")
  const [showWAForm, setShowWAForm] = useState(false)

  // Instagram Form
  const [igUserId, setIgUserId] = useState("")
  const [igToken, setIgToken] = useState("")
  const [showIGForm, setShowIGForm] = useState(false)

  // Messenger Form
  const [fbPageId, setFbPageId] = useState("")
  const [fbToken, setFbToken] = useState("")
  const [showFBForm, setShowFBForm] = useState(false)

  // Copy state
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const channels = overview?.channels || []
  const webhook = overview?.webhookInfo

  const waChannel = channels.find((c) => c.type === "WhatsApp")
  const igChannel = channels.find((c) => c.type === "Instagram")
  const fbChannel = channels.find((c) => c.type === "Messenger")

  const handleSaveWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!waPhoneId.trim() || !waToken.trim()) return
    await connectWA({
      phoneNumberId: waPhoneId.trim(),
      wabaId: waWabaId.trim() || undefined,
      accessToken: waToken.trim(),
    })
    setShowWAForm(false)
    setWaToken("")
  }

  const handleSaveInstagram = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!igUserId.trim() || !igToken.trim()) return
    await connectIG({
      igUserId: igUserId.trim(),
      accessToken: igToken.trim(),
    })
    setShowIGForm(false)
    setIgToken("")
  }

  const handleSaveMessenger = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fbPageId.trim() || !fbToken.trim()) return
    await connectFB({
      pageId: fbPageId.trim(),
      accessToken: fbToken.trim(),
    })
    setShowFBForm(false)
    setFbToken("")
  }

  const handleDisconnect = async (type: string) => {
    if (confirm(`¿Estás seguro de desconectar el canal ${type}?`)) {
      await disconnect(type)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center p-8">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs text-muted-foreground">Cargando canales...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Canales & Meta Cloud API</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Conectá tus números de WhatsApp y cuentas de redes sociales para automatizar respuestas con tu bot de IA.
            </p>
          </div>
        </div>
      </div>

      {isError && (
        <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>No se pudo sincronizar la información de los canales. Verificá que el backend esté activo.</span>
        </div>
      )}

      {/* Meta Webhook Global Card */}
      <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">Configuración de Webhook en Meta Developers</h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Registrá esta URL y Token en tu App de Meta (<strong className="font-medium text-foreground">WhatsApp &gt; Configuración &gt; Webhook</strong>) para que tu servidor reciba mensajes entrantes.
            </p>
          </div>
          <a
            href="https://developers.facebook.com/apps/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium shrink-0"
          >
            <span>Meta Developers</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t">
          <div className="space-y-1.5">
            <Label className="text-[11px] text-muted-foreground">URL del Webhook (WhatsApp)</Label>
            <div className="flex items-center gap-1.5">
              <Input
                readOnly
                value={webhook?.whatsAppCallbackUrl || "https://tuservidor.com/api/webhooks/whatsapp"}
                className="font-mono text-xs bg-muted/30"
              />
              <Button
                size="icon"
                variant="outline"
                type="button"
                className="h-9 w-9 shrink-0"
                onClick={() =>
                  copyToClipboard(
                    webhook?.whatsAppCallbackUrl || "",
                    "url-wa"
                  )
                }
              >
                {copiedKey === "url-wa" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] text-muted-foreground">Token de Verificación (Verify Token)</Label>
            <div className="flex items-center gap-1.5">
              <Input
                readOnly
                value={webhook?.verifyToken || "chatomnicanal_verify_token"}
                className="font-mono text-xs bg-muted/30"
              />
              <Button
                size="icon"
                variant="outline"
                type="button"
                className="h-9 w-9 shrink-0"
                onClick={() =>
                  copyToClipboard(
                    webhook?.verifyToken || "",
                    "token-verify"
                  )
                }
              >
                {copiedKey === "token-verify" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Channels List */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">Canales Disponibles</h2>

        {/* 1. WHATSAPP CLOUD API CARD */}
        <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-4 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-lg shadow-sm">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">WhatsApp Business (Cloud API)</h3>
                  {waChannel && waChannel.status === "Active" ? (
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 bg-emerald-500/10 text-[10px]">
                      Conectado
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px]">
                      No conectado
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Canal principal de atención. Utiliza la API oficial de Meta Cloud sin riesgo de baneo.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {waChannel && waChannel.status === "Active" ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setWaPhoneId(waChannel.phoneNumberId || "")
                      setWaWabaId(waChannel.wabaId || "")
                      setShowWAForm(!showWAForm)
                    }}
                    className="text-xs h-8"
                  >
                    {showWAForm ? "Cancelar" : "Modificar"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDisconnect("WhatsApp")}
                    disabled={isDisconnectPending}
                    className="text-xs h-8 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Desconectar
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setShowWAForm(!showWAForm)}
                  className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                >
                  {showWAForm ? "Cancelar" : "Conectar WhatsApp"}
                </Button>
              )}
            </div>
          </div>

          {/* Active Connection Summary */}
          {waChannel && waChannel.status === "Active" && !showWAForm && (
            <div className="p-3 rounded-xl bg-muted/30 border text-xs grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-muted-foreground">Phone Number ID: </span>
                <span className="font-mono font-medium">{waChannel.phoneNumberId}</span>
              </div>
              <div>
                <span className="text-muted-foreground">WABA ID: </span>
                <span className="font-mono font-medium">{waChannel.wabaId || "No especificado"}</span>
              </div>
            </div>
          )}

          {/* WhatsApp Connection Form */}
          {showWAForm && (
            <form onSubmit={handleSaveWhatsApp} className="p-4 rounded-xl bg-muted/20 border space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Phone Number ID *</Label>
                  <Input
                    required
                    value={waPhoneId}
                    onChange={(e) => setWaPhoneId(e.target.value)}
                    placeholder="Ej. 104523984712034"
                    className="text-xs font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Encontralo en Meta &gt; WhatsApp &gt; Configuración de la API.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">WABA ID (Opcional)</Label>
                  <Input
                    value={waWabaId}
                    onChange={(e) => setWaWabaId(e.target.value)}
                    placeholder="Ej. 108923485721092"
                    className="text-xs font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Identificador de la cuenta comercial de WhatsApp.
                  </p>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <KeyRound className="h-3 w-3" />
                    <span>Access Token Permanente de Meta *</span>
                  </Label>
                  <Input
                    required
                    type="password"
                    value={waToken}
                    onChange={(e) => setWaToken(e.target.value)}
                    placeholder="EAAG..."
                    className="text-xs font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Token de Usuario del Sistema generado en Meta Business Manager con permisos <code>whatsapp_business_messaging</code>.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowWAForm(false)}
                  className="text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isWAPending || !waPhoneId.trim() || !waToken.trim()}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isWAPending ? "Guardando..." : "Guardar y Activar WhatsApp"}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* 2. INSTAGRAM DIRECT CARD */}
        <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-pink-500/10 text-pink-600 flex items-center justify-center font-bold text-lg shadow-sm">
                <span>IG</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">Instagram Direct</h3>
                  {igChannel && igChannel.status === "Active" ? (
                    <Badge variant="outline" className="border-pink-500/30 text-pink-600 bg-pink-500/10 text-[10px]">
                      Conectado
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px]">
                      No conectado
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Automatizá respuestas a mensajes directos y respuestas a historias en tu cuenta comercial de Instagram.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {igChannel && igChannel.status === "Active" ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIgUserId(igChannel.igUserId || "")
                      setShowIGForm(!showIGForm)
                    }}
                    className="text-xs h-8"
                  >
                    {showIGForm ? "Cancelar" : "Modificar"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDisconnect("Instagram")}
                    disabled={isDisconnectPending}
                    className="text-xs h-8 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Desconectar
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowIGForm(!showIGForm)}
                  className="text-xs h-8"
                >
                  {showIGForm ? "Cancelar" : "Conectar Instagram"}
                </Button>
              )}
            </div>
          </div>

          {igChannel && igChannel.status === "Active" && !showIGForm && (
            <div className="p-3 rounded-xl bg-muted/30 border text-xs">
              <span className="text-muted-foreground">Instagram User ID: </span>
              <span className="font-mono font-medium">{igChannel.igUserId}</span>
            </div>
          )}

          {showIGForm && (
            <form onSubmit={handleSaveInstagram} className="p-4 rounded-xl bg-muted/20 border space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Instagram Business Account ID *</Label>
                  <Input
                    required
                    value={igUserId}
                    onChange={(e) => setIgUserId(e.target.value)}
                    placeholder="Ej. 178414000000000"
                    className="text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold">Page Access Token *</Label>
                  <Input
                    required
                    type="password"
                    value={igToken}
                    onChange={(e) => setIgToken(e.target.value)}
                    placeholder="EAAG..."
                    className="text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowIGForm(false)}
                  className="text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isIGPending || !igUserId.trim() || !igToken.trim()}
                  className="text-xs"
                >
                  {isIGPending ? "Guardando..." : "Guardar Instagram"}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* 3. FACEBOOK MESSENGER CARD */}
        <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-lg shadow-sm">
                <span>FB</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">Facebook Messenger</h3>
                  {fbChannel && fbChannel.status === "Active" ? (
                    <Badge variant="outline" className="border-blue-500/30 text-blue-600 bg-blue-500/10 text-[10px]">
                      Conectado
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px]">
                      No conectado
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Atendé consultas provenientes de tu página de Facebook de forma unificada.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {fbChannel && fbChannel.status === "Active" ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setFbPageId(fbChannel.pageId || "")
                      setShowFBForm(!showFBForm)
                    }}
                    className="text-xs h-8"
                  >
                    {showFBForm ? "Cancelar" : "Modificar"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDisconnect("Messenger")}
                    disabled={isDisconnectPending}
                    className="text-xs h-8 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Desconectar
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowFBForm(!showFBForm)}
                  className="text-xs h-8"
                >
                  {showFBForm ? "Cancelar" : "Conectar Messenger"}
                </Button>
              )}
            </div>
          </div>

          {fbChannel && fbChannel.status === "Active" && !showFBForm && (
            <div className="p-3 rounded-xl bg-muted/30 border text-xs">
              <span className="text-muted-foreground">Facebook Page ID: </span>
              <span className="font-mono font-medium">{fbChannel.pageId}</span>
            </div>
          )}

          {showFBForm && (
            <form onSubmit={handleSaveMessenger} className="p-4 rounded-xl bg-muted/20 border space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Facebook Page ID *</Label>
                  <Input
                    required
                    value={fbPageId}
                    onChange={(e) => setFbPageId(e.target.value)}
                    placeholder="Ej. 109283746501928"
                    className="text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold">Page Access Token *</Label>
                  <Input
                    required
                    type="password"
                    value={fbToken}
                    onChange={(e) => setFbToken(e.target.value)}
                    placeholder="EAAG..."
                    className="text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFBForm(false)}
                  className="text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isFBPending || !fbPageId.trim() || !fbToken.trim()}
                  className="text-xs"
                >
                  {isFBPending ? "Guardando..." : "Guardar Messenger"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="p-4 rounded-xl bg-muted/20 border text-xs space-y-2 text-muted-foreground">
        <div className="flex items-center gap-1.5 font-semibold text-foreground">
          <HelpCircle className="h-4 w-4 text-primary" />
          <span>¿Cómo funciona la integración oficial de Meta?</span>
        </div>
        <p>
          1. Creás una aplicación de tipo <strong>Business</strong> en <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="text-primary underline">developers.facebook.com</a>.
        </p>
        <p>
          2. Agregás el producto <strong>WhatsApp</strong> y pegás la URL del Webhook y Verify Token que figuran arriba.
        </p>
        <p>
          3. Generás un Token Permanente de Usuario del Sistema en tu Business Manager y lo pegás en la tarjeta de WhatsApp.
        </p>
      </div>
    </div>
  )
}
