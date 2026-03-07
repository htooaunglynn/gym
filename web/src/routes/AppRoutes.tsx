import { Navigate, Route, Routes, Outlet } from 'react-router'
import { useAuth } from '@clerk/react'

import HomePage from '@/pages/HomePage'
// ... (imports remain)
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import SignInPage from '@/pages/auth/SignInPage'
import SignUpPage from '@/pages/auth/SignUpPage'
import SsoCallbackPage from '@/pages/auth/SsoCallbackPage'

import { DashboardLayout } from '@/components/layouts/dashboard/DashboardLayout'
import DashboardPage from '@/pages/admin/DashboardPage'
import MembersPage from '@/pages/admin/MembersPage'
import ClassesPage from '@/pages/admin/ClassesPage'
import PaymentsPage from '@/pages/admin/PaymentsPage'
import SettingsPage from '@/pages/admin/SettingsPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth()
  if (!isLoaded) return null
  if (!isSignedIn) return <Navigate replace to="/sign-in" />
  return <>{children}</>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      
      {/* Admin Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout children={<Outlet />} />
          </ProtectedRoute>
        }
        path="/admin"
      >
        <Route index element={<DashboardPage />} />
        <Route element={<MembersPage />} path="members" />
        <Route element={<ClassesPage />} path="classes" />
        <Route element={<PaymentsPage />} path="payments" />
        <Route element={<SettingsPage />} path="settings" />
      </Route>

      <Route element={<SignInPage />} path="/sign-in" />
      <Route element={<SignUpPage />} path="/sign-up" />
      <Route element={<ForgotPasswordPage />} path="/forgot-password" />
      <Route element={<SsoCallbackPage />} path="/sso-callback" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  )
}
