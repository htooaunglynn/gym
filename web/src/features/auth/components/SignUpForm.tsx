import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion } from 'framer-motion'

import { signUp as signUpApi } from '@/features/auth/api/auth-api'
import { useAuthStore } from '@/store/auth-store'
import { fadeIn } from '@/lib/motion-variants'

import { SignUpFields } from './steps/SignUpFields'

export function SignUpForm() {
    const navigate = useNavigate()
    const login = useAuthStore((s) => s.login)

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleCreateAccount = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.')
            return
        }

        setIsSubmitting(true)
        setErrorMessage('')

        try {
            const res = await signUpApi({ name: username, email, password })
            login(res.accessToken, res.refreshToken, res.user)
            navigate('/', { replace: true })
        } catch (error: unknown) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to create your account right now.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-5">
            <motion.form
                variants={fadeIn}
                initial="initial"
                animate="animate"
                onSubmit={handleCreateAccount}
            >
                <SignUpFields
                    confirmPassword={confirmPassword}
                    email={email}
                    errorMessage={errorMessage}
                    isSubmitting={isSubmitting}
                    onSocialError={setErrorMessage}
                    password={password}
                    setConfirmPassword={setConfirmPassword}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    setUsername={setUsername}
                    username={username}
                />
            </motion.form>

            <p className="text-right text-sm">
                Already have an account?{' '}
                <Link className="dark:text-amber-500 dark:hover:text-amber-600 font-medium text-amber-700 transition hover:text-amber-800" to="/sign-in">
                    Sign in
                </Link>
            </p>
        </div>
    )
}
