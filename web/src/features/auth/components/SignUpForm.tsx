import { type FormEvent, useState } from 'react'
import { useSignUp } from '@clerk/react-router'
import { Link, useNavigate } from 'react-router'
import { motion } from 'framer-motion'

import { getClerkErrorMessage } from '@/features/auth/utils/clerk-errors'
import { LoadingState } from '@/components/shared/LoadingState'
import { fadeIn } from '@/lib/motion-variants'

import { SignUpFields } from './steps/SignUpFields'
import { ClerkCaptcha } from './ClerkCaptcha'

export function SignUpForm() {
  const navigate = useNavigate()
  const { signUp } = useSignUp()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleCreateAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!signUp) {
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const { error } = await signUp.password({
        username,
        emailAddress: email,
        password,
      })

      if (error) {
        setErrorMessage(getClerkErrorMessage(error, 'Unable to create your account right now.'))
        return
      }

      if (signUp.status === 'complete') {
        const { error: finalizeError } = await signUp.finalize()
        if (finalizeError) {
          setErrorMessage(getClerkErrorMessage(finalizeError, 'Account created but could not activate session.'))
          return
        }
      } else if (signUp.status === 'missing_requirements') {
        setErrorMessage('Verification Required. Please set "Verification" to "Optional" in your Clerk Dashboard settings to skip immediate verification.')
        return
      }

      navigate('/', { replace: true })
    } catch (error: unknown) {
      setErrorMessage(getClerkErrorMessage(error, 'Unable to create your account right now.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!signUp) {
    return (
      <LoadingState
        subtitle="Loading account creation steps..."
        title="Preparing secure sign-up"
      />
    )
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
          auth={signUp}
          confirmPassword={confirmPassword}
          email={email}
          errorMessage={errorMessage}
          isSubmitting={isSubmitting}
          password={password}
          setConfirmPassword={setConfirmPassword}
          setEmail={setEmail}
          setPassword={setPassword}
          setUsername={setUsername}
          username={username}
        />
      </motion.form>

      <ClerkCaptcha />

      <p className="text-right text-sm">
        Already have an account?{' '}
        <Link className="dark:text-amber-500 dark:hover:text-amber-600 font-medium text-amber-700 transition hover:text-amber-800" to="/sign-in">
          Sign in
        </Link>
      </p>
    </div>
  )
}
