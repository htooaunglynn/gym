import { Navigate, Route, Routes, Outlet } from 'react-router'
import { useAuth, useUser } from '@clerk/react'

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

import MemberDashboardPage from '@/pages/member/DashboardPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth()
  if (!isLoaded) return null
  if (!isSignedIn) return <Navigate replace to="/sign-in" />
  return <>{children}</>
}

function RoleProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode, 
  allowedRoles: string[] 
}) {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth()
  const { isLoaded: isUserLoaded, user } = useUser()

  if (!isAuthLoaded || !isUserLoaded) return null
  if (!isSignedIn) return <Navigate replace to="/sign-in" />

  const userRole = user?.publicMetadata?.role as string | undefined
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate replace to="/dashboard" />
  }

  return <>{children}</>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      
      {/* Admin Routes */}
      <Route
        element={
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout children={<Outlet />} />
          </RoleProtectedRoute>
        }
        path="/admin"
      >
        <Route index element={<DashboardPage />} />
        <Route element={<MembersPage />} path="members" />
        <Route element={<ClassesPage />} path="classes" />
        <Route element={<PaymentsPage />} path="payments" />
        <Route element={<SettingsPage />} path="settings" />
      </Route>

      {/* Member Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout children={<Outlet />} />
          </ProtectedRoute>
        }
        path="/dashboard"
      >
        <Route index element={<MemberDashboardPage />} />
        {/* Fillers for pages that will be implemented later */}
        <Route element={<div className="p-8"><h1 className="text-2xl font-bold">Schedule coming soon...</h1></div>} path="schedule" />
        <Route element={<div className="p-8"><h1 className="text-2xl font-bold">Workouts coming soon...</h1></div>} path="workouts" />
        <Route element={<div className="p-8"><h1 className="text-2xl font-bold">Progress coming soon...</h1></div>} path="progress" />
        <Route element={<div className="p-8"><h1 className="text-2xl font-bold">Profile coming soon...</h1></div>} path="profile" />
        <Route element={<div className="p-8"><h1 className="text-2xl font-bold">Membership coming soon...</h1></div>} path="membership" />
      </Route>

      <Route element={<SignInPage />} path="/sign-in" />
      <Route element={<SignUpPage />} path="/sign-up" />
      <Route element={<ForgotPasswordPage />} path="/forgot-password" />
      <Route element={<SsoCallbackPage />} path="/sso-callback" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  )
}
