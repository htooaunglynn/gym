import { type FormEvent, useState } from 'react'
import { useSignIn } from '@clerk/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router'

import { getClerkErrorMessage } from '@/features/auth/utils/clerk-errors'
import { LoadingState } from '@/components/shared/LoadingState'
import { stepTransition } from '@/lib/motion-variants'

import { ForgotPasswordRequestStep } from './steps/ForgotPasswordRequestStep'
import { ForgotPasswordResetStep } from './steps/ForgotPasswordResetStep'

export function ForgotPasswordForm() {
  const navigate = useNavigate()
  const { signIn } = useSignIn()

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

    if (!signIn) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const { error: createError } = await signIn.create({ identifier: email })
      if (createError) {
        setErrorMessage(getClerkErrorMessage(createError, 'Could not request a password reset code.'))
        return
      }

      const { error: sendError } = await signIn.resetPasswordEmailCode.sendCode()
      if (sendError) {
        setErrorMessage(getClerkErrorMessage(sendError, 'Could not request a password reset code.'))
        return
      }

      setStep('reset')
      setSuccessMessage('Check your email for the verification code.')
    } catch (error: unknown) {
      setErrorMessage(getClerkErrorMessage(error, 'Could not request a password reset code.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitNewPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!signIn) {
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const { error: verifyError } = await signIn.resetPasswordEmailCode.verifyCode({ code })
      if (verifyError) {
        setErrorMessage(getClerkErrorMessage(verifyError, 'Invalid reset code.'))
        return
      }

      const { error: submitError } = await signIn.resetPasswordEmailCode.submitPassword({ password: newPassword })
      if (submitError) {
        setErrorMessage(getClerkErrorMessage(submitError, 'Could not reset password.'))
        return
      }

      if (signIn.status === 'complete') {
        const { error: finalizeError } = await signIn.finalize()
        if (finalizeError) {
          setErrorMessage(getClerkErrorMessage(finalizeError, 'Password reset was successful, but session could not be activated.'))
          return
        }
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
    if (!signIn || isResending) {
      return
    }

    setIsResending(true)
    setErrorMessage('')

    try {
      const { error } = await signIn.resetPasswordEmailCode.sendCode()
      if (error) {
        setErrorMessage(getClerkErrorMessage(error, 'Unable to resend code right now.'))
        return
      }
      setSuccessMessage('A new code has been sent to your email.')
    } catch (error: unknown) {
      setErrorMessage(getClerkErrorMessage(error, 'Unable to resend code right now.'))
    } finally {
      setIsResending(false)
    }
  }

  if (!signIn) {
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
