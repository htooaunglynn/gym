import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useAuth as useClerkAuth } from '@clerk/react'

import { AuthLayout } from '@/components/layouts/auth/AuthLayout'
import { LoadingState } from '@/components/shared/LoadingState'
import { socialAuth } from '@/features/auth/api/auth-api'
import { useAuthStore } from '@/store/auth-store'

export default function SsoCallbackPage() {
    const navigate = useNavigate()
    const { isLoaded, isSignedIn, getToken } = useClerkAuth()
    const login = useAuthStore((s) => s.login)
    const exchanged = useRef(false)

    useEffect(() => {
        if (!isLoaded || !isSignedIn || exchanged.current) return
        exchanged.current = true

            ; (async () => {
                try {
                    const clerkToken = await getToken()
                    if (!clerkToken) throw new Error('No Clerk token')

                    const res = await socialAuth(clerkToken)
                    login(res.accessToken, res.refreshToken, res.user)
                    navigate('/', { replace: true })
                } catch {
                    navigate('/sign-in', { replace: true })
                }
            })()
    }, [isLoaded, isSignedIn, getToken, login, navigate])

    return (
        <AuthLayout subtitle="Completing secure provider authentication." title="Signing you in">
            <LoadingState
                subtitle="Please wait while we finalize your social sign-in..."
                title="Finishing authentication"
            />
        </AuthLayout>
    )
}
