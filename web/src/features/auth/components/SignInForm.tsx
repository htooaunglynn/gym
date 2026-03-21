import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'

import { signIn as signInApi } from '@/features/auth/api/auth-api'
import { useAuthStore } from '@/store/auth-store'
import { fadeIn } from '@/lib/motion-variants'

import { SignInCredentialsStep } from './steps/SignInCredentialsStep'
import { ClerkCaptcha } from './ClerkCaptcha'

export function SignInForm() {
    const navigate = useNavigate()
    const login = useAuthStore((s) => s.login)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        setIsSubmitting(true)
        setErrorMessage('')

        try {
            const { accessToken, refreshToken, user } = await signInApi(email, password)
            login(accessToken, refreshToken, user)
            navigate('/', { replace: true })
        } catch (error: unknown) {
            setErrorMessage(error instanceof Error ? error.message : 'Invalid credentials. Please check and try again.')
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-5">
            <motion.div
                variants={fadeIn}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.25, ease: 'easeOut' }}
            >
                <SignInCredentialsStep
                    email={email}
                    errorMessage={errorMessage}
                    isSubmitting={isSubmitting}
                    onSocialError={setErrorMessage}
                    onSubmit={handleSubmit}
                    password={password}
                    setEmail={setEmail}
                    setPassword={setPassword}
                />
            </motion.div>

            <ClerkCaptcha />
        </div>
    )
}
