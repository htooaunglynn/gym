import { Navigate } from 'react-router'

import { AuthLayout } from '@/components/layouts/auth/AuthLayout'
import { SignUpForm } from '@/features/auth/components/SignUpForm'
import { useAuthStore } from '@/store/auth-store'

export default function SignUpPage() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

    if (isAuthenticated) {
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
