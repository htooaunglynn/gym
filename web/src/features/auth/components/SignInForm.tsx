import { type FormEvent, useEffect, useState } from 'react'
import { useSignIn } from '@clerk/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router'

import { getClerkErrorMessage } from '@/features/auth/utils/clerk-errors'
import { LoadingState } from '@/components/shared/LoadingState'
import { stepTransition } from '@/lib/motion-variants'

import { SignInCredentialsStep } from './steps/SignInCredentialsStep'
import { SignInMfaStep } from './steps/SignInMfaStep'
import { ClerkCaptcha } from './ClerkCaptcha'

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

      if (signIn.status === 'needs_client_trust') {
        setIsSubmitting(false)
        return
      }
    } catch (error: unknown) {
      setErrorMessage(getClerkErrorMessage(error, 'Invalid credentials. Please check and try again.'))
      setIsSubmitting(false)
    }
  }

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
        <motion.div
          key={step}
          variants={stepTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {step === 'credentials' ? (
            <SignInCredentialsStep
              auth={signIn}
              email={email}
              errorMessage={errorMessage}
              isSubmitting={isSubmitting}
              onSocialError={setErrorMessage}
              onSubmit={handleSubmit}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
            />
          ) : (
            <SignInMfaStep
              code={code}
              errorMessage={errorMessage}
              isResending={isResending}
              isSubmitting={isSubmitting}
              onBack={() => {
                setStep('credentials')
                setErrorMessage('')
                setSuccessMessage('')
              }}
              onResend={handleResendCode}
              onSubmit={handleVerifyCode}
              successMessage={successMessage}
              setCode={setCode}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <ClerkCaptcha />
    </div>
  )
}
