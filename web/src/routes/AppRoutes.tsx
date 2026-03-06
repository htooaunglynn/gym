import { Navigate, Route, Routes } from 'react-router'

import HomePage from '@/pages/HomePage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import SignInPage from '@/pages/auth/SignInPage'
import SignUpPage from '@/pages/auth/SignUpPage'
import SsoCallbackPage from '@/pages/auth/SsoCallbackPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<SignInPage />} path="/sign-in" />
      <Route element={<SignUpPage />} path="/sign-up" />
      <Route element={<ForgotPasswordPage />} path="/forgot-password" />
      <Route element={<SsoCallbackPage />} path="/sso-callback" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  )
}
