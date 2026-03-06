import { useAuth } from '@clerk/react'
import { Navigate } from 'react-router'

import { AuthLayout } from '@/components/layouts/auth/AuthLayout'
import { LoadingState } from '@/components/shared/LoadingState'
import { SignUpForm } from '@/features/auth/components/SignUpForm'

export default function SignUpPage() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <AuthLayout
        subtitle="Create your account and start managing workouts with a smooth onboarding experience."
        title="Create account"
      >
        <LoadingState
          subtitle="Loading account creation steps..."
          title="Preparing secure sign-up"
        />
      </AuthLayout>
    )
  }

  if (isSignedIn) {
    return <Navigate replace to="/" />
  }

  return (
    <AuthLayout
      subtitle="Create your account and start managing workouts with a smooth onboarding experience."
      title="Create account"
    >
      <SignUpForm />
    </AuthLayout>
  )
}
