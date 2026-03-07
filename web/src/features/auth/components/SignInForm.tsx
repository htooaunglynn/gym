import { type FormEvent, useEffect, useState } from 'react'
import { useSignIn } from '@clerk/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, RotateCw } from 'lucide-react'
import { Link, useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import { getClerkErrorMessage } from '@/features/auth/utils/clerk-errors'

import { FeedbackMessage } from '@/components/shared/FeedbackMessage'
import { FormInput } from '@/components/shared/forms/FormInput'
import { LoadingState } from '@/components/shared/LoadingState'

import { SocialSignInButtons } from './SocialSignInButtons'
import { ClerkCaptcha } from './ClerkCaptcha'

const stepTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: 'easeOut' },
} as const

export function SignInForm() {
  const navigate = useNavigate()
  const { signIn } = useSignIn()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'credentials' | 'verify'>('credentials')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!signIn) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const { error } = await signIn.password({
        identifier: email,
        password,
      })

      if (error) {
        setErrorMessage(getClerkErrorMessage(error, 'Invalid credentials. Please check and try again.'))
        setIsSubmitting(false)
        return
      }

      // If status is complete, finalize immediately
      if (signIn.status === 'complete') {
        const { error: finalizeError } = await signIn.finalize()
        if (finalizeError) {
          setErrorMessage(getClerkErrorMessage(finalizeError, 'Sign in complete but session could not be activated.'))
          setIsSubmitting(false)
          return
        }
        navigate('/', { replace: true })
        return
      }

      // If status is needs_client_trust, we don't call prepare yet.
      // We wait for the ClerkCaptcha component to resolve the challenge.
      // The useEffect below will watch for the status change.
      if (signIn.status === 'needs_client_trust') {
        setIsSubmitting(false)
        return
      }

      // If it moves directly to second factor, preparation happens in useEffect
    } catch (error: unknown) {
      setErrorMessage(getClerkErrorMessage(error, 'Invalid credentials. Please check and try again.'))
      setIsSubmitting(false)
    }
  }

  // Handle status transitions automatically (e.g., after Captcha or device trust)
  useEffect(() => {
    if (!signIn || step === 'verify') {
      return
    }

    const prepareMFA = async () => {
      if (signIn.status === 'needs_second_factor') {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error: prepareError } = await (signIn as any).prepareSecondFactor({ strategy: 'email_code' })
          
          if (prepareError) {
            setErrorMessage(getClerkErrorMessage(prepareError, 'Verification required, but could not send code.'))
            return
          }

          setSuccessMessage('A verification code has been sent to your email.')
          setStep('verify')
        } catch (error) {
          setErrorMessage(getClerkErrorMessage(error, 'Could not initiate verification.'))
        }
      }
    }

    prepareMFA()
  }, [signIn?.status, signIn, step])

  const handleVerifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!signIn) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (signIn as any).attemptSecondFactor({
        strategy: 'email_code',
        code,
      })

      if (error) {
        setErrorMessage(getClerkErrorMessage(error, 'Invalid verification code.'))
        return
      }

      if (signIn.status === 'complete') {
        const { error: finalizeError } = await signIn.finalize()
        if (finalizeError) {
          setErrorMessage(getClerkErrorMessage(finalizeError, 'Verified but could not activate session.'))
          return
        }
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
    if (!signIn || isResending) {
      return
    }

    setIsResending(true)
    setErrorMessage('')

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (signIn as any).prepareSecondFactor({ strategy: 'email_code' })
      if (error) {
        setErrorMessage(getClerkErrorMessage(error, 'Unable to resend code right now.'))
        return
      }
      setSuccessMessage('A fresh verification code has been sent.')
    } catch (error: unknown) {
      setErrorMessage(getClerkErrorMessage(error, 'Unable to resend code right now.'))
    } finally {
      setIsResending(false)
    }
  }

  if (!signIn) {
    return <LoadingState />
  }

  return (
    <div className="space-y-5">
      <AnimatePresence mode="wait">
        {step === 'credentials' ? (
          <motion.div key="credentials" className="space-y-5" {...stepTransition}>
            <SocialSignInButtons auth={signIn} disabled={isSubmitting} onError={setErrorMessage} />

            <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              <span>or use email</span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <FormInput
                autoComplete="email"
                label="Email address"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email address"
                required
                type="email"
                value={email}
              />

              <FormInput
                autoComplete="current-password"
                label="Password"
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                type="password"
                value={password}
              />

              <FeedbackMessage text={errorMessage} type="error" />

              <Button
                className="h-11 w-full rounded-xl bg-slate-900 text-base font-medium hover:bg-slate-800"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="flex items-center justify-between text-sm">
              <Link className="text-slate-600 transition hover:text-slate-900" to="/forgot-password">
                Forgot password?
              </Link>
              <Link className="font-medium text-amber-700 transition hover:text-amber-800" to="/sign-up">
                Create account
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.form key="verify" className="space-y-4" onSubmit={handleVerifyCode} {...stepTransition}>
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

            <Button
              className="w-full text-slate-500 hover:text-slate-900"
              onClick={() => {
                setStep('credentials')
                setErrorMessage('')
                setSuccessMessage('')
              }}
              type="button"
              variant="ghost"
            >
              Back to sign in
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      <ClerkCaptcha />
    </div>
  )
}
