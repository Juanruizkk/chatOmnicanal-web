import { createBrowserRouter, Navigate } from "react-router-dom"
import { SignIn, SignUp } from "@clerk/clerk-react"
import { ProtectedRoute, TenantRoute } from "./components/layout/ProtectedRoute"
import { AppLayout } from "./components/layout/AppLayout"
import { AuthLayout } from "./components/layout/AuthLayout"
import { ConversationsPage } from "./pages/ConversationsPage"
import { ChatPage } from "./pages/ChatPage"
import { SettingsProfilePage } from "./pages/SettingsProfilePage"
import { SettingsDocumentsPage } from "./pages/SettingsDocumentsPage"
import { SettingsAgentsPage } from "./pages/SettingsAgentsPage"
import { SettingsChannelsPage } from "./pages/SettingsChannelsPage"
import { SimulationPage } from "./pages/SimulationPage"
import { OnboardingPage } from "./pages/OnboardingPage"

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/sign-in/*",
        element: <SignIn routing="path" path="/sign-in" />,
      },
      {
        path: "/sign-up/*",
        element: <SignUp routing="path" path="/sign-up" />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "onboarding", element: <OnboardingPage /> },
      {
        element: <TenantRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { index: true, element: <Navigate to="/conversations" replace /> },
              { path: "conversations", element: <ConversationsPage /> },
              { path: "conversations/:id", element: <ChatPage /> },
              { path: "simulation", element: <SimulationPage /> },
              { path: "settings/profile", element: <SettingsProfilePage /> },
              { path: "settings/documents", element: <SettingsDocumentsPage /> },
              { path: "settings/agents", element: <SettingsAgentsPage /> },
              { path: "settings/channels", element: <SettingsChannelsPage /> },
            ],
          },
        ],
      },
    ],
  },
])
