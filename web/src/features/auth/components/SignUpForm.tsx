import { type FormEvent, useState } from 'react'
import { useSignUp } from '@clerk/react-router'
import { Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import { getClerkErrorMessage } from '@/features/auth/utils/clerk-errors'

import { FeedbackMessage } from '@/components/shared/FeedbackMessage'
import { FormInput } from '@/components/shared/forms/FormInput'
import { LoadingState } from '@/components/shared/LoadingState'

import { SocialSignInButtons } from './SocialSignInButtons'
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

      // Skip sending verification code here, we'll do it on the dashboard
      
      // If the sign up is complete (could happen if no verification is required by Clerk config)
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

      // Redirect to root/dashboard regardless of status, as long as the user was created
      // The DashboardLayout will handle the verification prompt
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
      <form className="space-y-4" onSubmit={handleCreateAccount}>
        <SocialSignInButtons auth={signUp} disabled={isSubmitting} onError={setErrorMessage} />

        <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          <span>or use email</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <FormInput
          autoComplete="username"
          label="Username"
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Choose a unique username"
          required
          type="text"
          value={username}
        />

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
      </form>

      {/* ClerkCaptcha must stay mounted at all times */}
      <ClerkCaptcha />

      <p className="text-right text-sm">
        Already have an account?{' '}
        <Link className="font-medium text-amber-700 transition hover:text-amber-800" to="/sign-in">
          Sign in
        </Link>
      </p>
    </div>
  )
}
