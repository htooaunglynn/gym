import { Navigate } from 'react-router'

import { AuthLayout } from '@/components/layouts/auth/AuthLayout'
import { SignInForm } from '@/features/auth/components/SignInForm'
import { useAuthStore } from '@/store/auth-store'

export default function SignInPage() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

    if (isAuthenticated) {
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
