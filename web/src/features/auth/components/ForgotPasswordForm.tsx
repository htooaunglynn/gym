import { type FormEvent, useState } from 'react'
import { useSignIn } from '@clerk/react/legacy'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, RotateCw } from 'lucide-react'
import { Link, useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import { getClerkErrorMessage } from '@/features/auth/utils/clerk-errors'

import { FeedbackMessage } from '@/components/shared/FeedbackMessage'
import { FormInput } from '@/components/shared/forms/FormInput'
import { LoadingState } from '@/components/shared/LoadingState'

const stepTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: 'easeOut' },
} as const

export function ForgotPasswordForm() {
  const navigate = useNavigate()
  const { isLoaded, signIn, setActive } = useSignIn()

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

    if (!isLoaded) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const attempt = await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      })

      if (attempt.status === 'needs_first_factor' || attempt.status === 'needs_new_password') {
        setStep('reset')
        setSuccessMessage('Check your email for the verification code.')
        return
      }

      setErrorMessage('Unable to start reset flow. Please try again.')
    } catch (error: unknown) {
      setErrorMessage(getClerkErrorMessage(error, 'Could not request a password reset code.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitNewPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isLoaded) {
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const attempt = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password: newPassword,
      })

      if (attempt.status === 'complete' && attempt.createdSessionId) {
        await setActive({ session: attempt.createdSessionId })
        navigate('/', { replace: true })
        return
      }

      setErrorMessage('Password reset was not completed. Please try again.')
    } catch (error: unknown) {
      setErrorMessage(getClerkErrorMessage(error, 'Invalid reset code or password.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const resendCode = async () => {
    if (!isLoaded || isResending) {
      return
    }

    setIsResending(true)
    setErrorMessage('')

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      })
      setSuccessMessage('A new code has been sent to your email.')
    } catch (error: unknown) {
      setErrorMessage(getClerkErrorMessage(error, 'Unable to resend code right now.'))
    } finally {
      setIsResending(false)
    }
  }

  if (!isLoaded) {
    return (
      <LoadingState
        subtitle="Loading password recovery controls..."
        title="Preparing password reset"
      />
    )
  }

  return (
    <div className="space-y-5">
      <AnimatePresence mode="wait">
        {step === 'request' ? (
          <motion.form key="request" className="space-y-4" onSubmit={requestResetCode} {...stepTransition}>
            <FormInput
              autoComplete="email"
              label="Account email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your account email"
              required
              type="email"
              value={email}
            />

            <FeedbackMessage text={errorMessage} type="error" />

            <Button
              className="h-11 w-full rounded-xl bg-slate-900 text-base font-medium hover:bg-slate-800"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {isSubmitting ? 'Sending code...' : 'Send reset code'}
            </Button>
          </motion.form>
        ) : (
          <motion.form key="reset" className="space-y-4" onSubmit={submitNewPassword} {...stepTransition}>
            <FormInput
              autoComplete="one-time-code"
              label="Password reset code"
              inputMode="numeric"
              maxLength={6}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Enter the 6-digit reset code"
              required
              type="text"
              value={code}
            />

            <FormInput
              autoComplete="new-password"
              label="New password"
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Create a new password"
              required
              type="password"
              value={newPassword}
            />

            <FormInput
              autoComplete="new-password"
              label="Confirm new password"
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repeat the new password"
              required
              type="password"
              value={confirmPassword}
            />

            <FeedbackMessage text={successMessage} type="success" />
            <FeedbackMessage text={errorMessage} type="error" />

            <Button
              className="h-11 w-full rounded-xl bg-slate-900 text-base font-medium hover:bg-slate-800"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {isSubmitting ? 'Updating password...' : 'Reset password'}
            </Button>

            <Button
              className="w-full rounded-xl"
              disabled={isResending}
              onClick={resendCode}
              type="button"
              variant="outline"
            >
              {isResending ? <RotateCw className="size-4 animate-spin" /> : null}
              {isResending ? 'Resending code...' : 'Resend code'}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      <p className="flex items-center justify-between text-sm">
        <Link className="text-slate-600 transition hover:text-slate-900" to="/sign-in">
          Back to sign in
        </Link>
        <Link className="font-medium text-amber-700 transition hover:text-amber-800" to="/sign-up">
          Create account
        </Link>
      </p>
    </div>
  )
}
