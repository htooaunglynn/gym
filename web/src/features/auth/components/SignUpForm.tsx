import { type FormEvent, useState } from 'react'
import { useSignUp } from '@clerk/react/legacy'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, RotateCw } from 'lucide-react'
import { Link, useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import { getClerkErrorMessage } from '@/features/auth/utils/clerk-errors'

import { FeedbackMessage } from '@/components/shared/FeedbackMessage'
import { FormInput } from '@/components/shared/forms/FormInput'
import { LoadingState } from '@/components/shared/LoadingState'

import { SocialSignInButtons } from './SocialSignInButtons'

const stepTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: 'easeOut' },
} as const

export function SignUpForm() {
  const navigate = useNavigate()
  const { isLoaded, signUp, setActive } = useSignUp()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'details' | 'verify'>('details')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleCreateAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isLoaded) {
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const attempt = await signUp.create({
        emailAddress: email,
        password,
      })

      if (attempt.status === 'complete' && attempt.createdSessionId) {
        await setActive({ session: attempt.createdSessionId })
        navigate('/', { replace: true })
        return
      }

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setSuccessMessage('We sent a verification code to your email address.')
      setStep('verify')
    } catch (error: unknown) {
      setErrorMessage(getClerkErrorMessage(error, 'Unable to create your account right now.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isLoaded) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code })

      if (attempt.status === 'complete' && attempt.createdSessionId) {
        await setActive({ session: attempt.createdSessionId })
        navigate('/', { replace: true })
        return
      }

      setErrorMessage('Verification is not complete yet. Please try again.')
    } catch (error: unknown) {
      setErrorMessage(getClerkErrorMessage(error, 'Invalid verification code.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendCode = async () => {
    if (!isLoaded || isResending) {
      return
    }

    setIsResending(true)
    setErrorMessage('')

    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setSuccessMessage('A fresh verification code has been sent.')
    } catch (error: unknown) {
      setErrorMessage(getClerkErrorMessage(error, 'Unable to resend code right now.'))
    } finally {
      setIsResending(false)
    }
  }

  if (!isLoaded) {
    return (
      <LoadingState
        subtitle="Loading account creation steps..."
        title="Preparing secure sign-up"
      />
    )
  }

  return (
    <div className="space-y-5">
      <AnimatePresence mode="wait">
        {step === 'details' ? (
          <motion.form key="details" className="space-y-4" onSubmit={handleCreateAccount} {...stepTransition}>
            <SocialSignInButtons auth={signUp} disabled={isSubmitting} onError={setErrorMessage} />

            <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              <span>or use email</span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <FormInput
              autoComplete="email"
              label="Email address"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email address"
              required
              type="email"
              value={email}
            />

            <FormInput
              autoComplete="new-password"
              label="Create password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a strong password"
              required
              type="password"
              value={password}
            />

            <FormInput
              autoComplete="new-password"
              label="Confirm password"
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repeat your password"
              required
              type="password"
              value={confirmPassword}
            />

            <FeedbackMessage text={errorMessage} type="error" />

            <Button
              className="h-11 w-full rounded-xl bg-slate-900 text-base font-medium hover:bg-slate-800"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
          </motion.form>
        ) : (
          <motion.form key="verify" className="space-y-4" onSubmit={handleVerifyEmail} {...stepTransition}>
            <FormInput
              autoComplete="one-time-code"
              label="Email verification code"
              inputMode="numeric"
              maxLength={6}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Enter the 6-digit email code"
              required
              type="text"
              value={code}
            />

            <FeedbackMessage text={successMessage} type="success" />
            <FeedbackMessage text={errorMessage} type="error" />

            <Button
              className="h-11 w-full rounded-xl bg-slate-900 text-base font-medium hover:bg-slate-800"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {isSubmitting ? 'Verifying...' : 'Verify and continue'}
            </Button>

            <Button
              className="w-full rounded-xl"
              disabled={isResending}
              onClick={handleResendCode}
              type="button"
              variant="outline"
            >
              {isResending ? <RotateCw className="size-4 animate-spin" /> : null}
              {isResending ? 'Sending code...' : 'Resend code'}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      <p className="text-right text-sm">
        Already have an account?{' '}
        <Link className="font-medium text-amber-700 transition hover:text-amber-800" to="/sign-in">
          Sign in
        </Link>
      </p>
    </div>
  )
}
