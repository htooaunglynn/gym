import { HandleSSOCallback } from '@clerk/react'
import { useNavigate } from 'react-router'

import { AuthLayout } from '@/components/layouts/auth/AuthLayout'
import { LoadingState } from '@/components/shared/LoadingState'

export default function SsoCallbackPage() {
  const navigate = useNavigate()

  return (
    <AuthLayout subtitle="Completing secure provider authentication." title="Signing you in">
      <LoadingState
        subtitle="Please wait while we finalize your social sign-in..."
        title="Finishing authentication"
      />

      <HandleSSOCallback
        navigateToApp={({ decorateUrl }) => {
          const destination = decorateUrl('/')

          if (destination.startsWith('http')) {
            window.location.href = destination
            return
          }

          navigate(destination, { replace: true })
        }}
        navigateToSignIn={() => {
          navigate('/sign-in', { replace: true })
        }}
        navigateToSignUp={() => {
          navigate('/sign-up', { replace: true })
        }}
      />
    </AuthLayout>
  )
}
