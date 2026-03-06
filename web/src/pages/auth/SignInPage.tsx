import { useAuth } from '@clerk/react'
import { Navigate } from 'react-router'

import { AuthLayout } from '@/components/layouts/auth/AuthLayout'
import { LoadingState } from '@/components/shared/LoadingState'
import { SignInForm } from '@/features/auth/components/SignInForm'

export default function SignInPage() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <AuthLayout
        subtitle="Sign in to access your training dashboard and continue where you left off."
        title="Sign in"
      >
        <LoadingState />
      </AuthLayout>
    )
  }

  if (isSignedIn) {
    return <Navigate replace to="/" />
  }

  return (
    <AuthLayout
      subtitle="Sign in to access your training dashboard and continue where you left off."
      title="Sign in"
    >
      <SignInForm />
    </AuthLayout>
  )
}
