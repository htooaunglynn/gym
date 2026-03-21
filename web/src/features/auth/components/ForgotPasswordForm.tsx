import { type FormEvent, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router'

import { forgotPassword, resetPassword } from '@/features/auth/api/auth-api'
import { stepTransition } from '@/lib/motion-variants'

import { ForgotPasswordRequestStep } from './steps/ForgotPasswordRequestStep'
import { ForgotPasswordResetStep } from './steps/ForgotPasswordResetStep'

export function ForgotPasswordForm() {
    const navigate = useNavigate()

    const [step, setStep] = useState<'request' | 'reset'>('request')
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const requestResetCode = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitting(true)
        setErrorMessage('')

        try {
            await forgotPassword(email)
            setStep('reset')
            setSuccessMessage('Check your email for the verification code.')
        } catch (error: unknown) {
            setErrorMessage(error instanceof Error ? error.message : 'Could not request a password reset code.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const submitNewPassword = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (newPassword !== confirmPassword) {
            setErrorMessage('New passwords do not match.')
            return
        }

        setIsSubmitting(true)
        setErrorMessage('')

        try {
            await resetPassword(email, code, newPassword)
            navigate('/sign-in', { replace: true })
        } catch (error: unknown) {
            setErrorMessage(error instanceof Error ? error.message : 'Invalid reset code or password.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const resendCode = async () => {
        if (isResending) return

        setIsResending(true)
        setErrorMessage('')

        try {
            await forgotPassword(email)
            setSuccessMessage('A new code has been sent to your email.')
        } catch (error: unknown) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to resend code right now.')
        } finally {
            setIsResending(false)
        }
    }

    return (
        <div className="space-y-5">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    variants={stepTransition}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                    {step === 'request' ? (
                        <ForgotPasswordRequestStep
                            email={email}
                            errorMessage={errorMessage}
                            isSubmitting={isSubmitting}
                            onSubmit={requestResetCode}
                            setEmail={setEmail}
                        />
                    ) : (
                        <ForgotPasswordResetStep
                            code={code}
                            confirmPassword={confirmPassword}
                            errorMessage={errorMessage}
                            isResending={isResending}
                            isSubmitting={isSubmitting}
                            newPassword={newPassword}
                            onResend={resendCode}
                            onSubmit={submitNewPassword}
                            setCode={setCode}
                            setConfirmPassword={setConfirmPassword}
                            setNewPassword={setNewPassword}
                            successMessage={successMessage}
                        />
                    )}
                </motion.div>
            </AnimatePresence>

            <p className="flex items-center justify-between text-sm">
                <Link className="text-slate-600 transition hover:text-slate-900" to="/sign-in">
                    Back to sign in
                </Link>
                <Link className="font-medium text-amber-700 dark:text-amber-500 transition hover:text-amber-800 dark:hover:text-amber-600" to="/sign-up">
                    Create account
                </Link>
            </p>
        </div>
    )
}
