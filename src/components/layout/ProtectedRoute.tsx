import { useAuth } from "@clerk/clerk-react"
import { Navigate, Outlet } from "react-router-dom"
import { setAuthTokenGetter } from "../../lib/apiClient"
import { useMe } from "../../hooks/useMe"

function FullScreenSpinner() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}

export function ProtectedRoute() {
  const { isLoaded, isSignedIn, getToken } = useAuth()

  if (!isLoaded) return <FullScreenSpinner />

  if (!isSignedIn) return <Navigate to="/sign-in" replace />

  // Se registra durante el render (no en un effect) para que las queries de los
  // hijos ya salgan con el token de Clerk en su primer request.
  setAuthTokenGetter(() => getToken())

  return <Outlet />
}

/** Exige que el usuario pertenezca a un tenant; si no, lo manda al onboarding. */
export function TenantRoute() {
  const { data: me, isLoading, isError } = useMe()

  if (isLoading) return <FullScreenSpinner />

  if (isError) return (
    <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
      No se pudo conectar con el servidor. Reintentá en unos segundos.
    </div>
  )

  if (!me?.tenant) return <Navigate to="/onboarding" replace />

  return <Outlet />
}
