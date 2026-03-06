import { useAuth } from '@clerk/react'
import { Navigate } from 'react-router'

import { AuthLayout } from '@/components/layouts/auth/AuthLayout'
import { LoadingState } from '@/components/shared/LoadingState'
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <AuthLayout
        subtitle="Recover access to your account in two quick steps."
        title="Forgot password"
      >
        <LoadingState
          subtitle="Loading password recovery controls..."
          title="Preparing password reset"
        />
      </AuthLayout>
    )
  }

  if (isSignedIn) {
    return <Navigate replace to="/" />
  }

  return (
    <AuthLayout
      subtitle="Recover access to your account in two quick steps."
      title="Forgot password"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
