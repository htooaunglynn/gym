import { Navigate } from 'react-router'

import { AuthLayout } from '@/components/layouts/auth/AuthLayout'
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'
import { useAuthStore } from '@/store/auth-store'

export default function ForgotPasswordPage() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

    if (isAuthenticated) {
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
