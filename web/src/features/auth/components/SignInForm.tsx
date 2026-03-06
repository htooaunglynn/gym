import { type FormEvent, useState } from 'react'
import { useSignIn } from '@clerk/react/legacy'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import { getClerkErrorMessage } from '@/features/auth/utils/clerk-errors'

import { FeedbackMessage } from '@/components/shared/FeedbackMessage'
import { FormInput } from '@/components/shared/forms/FormInput'
import { LoadingState } from '@/components/shared/LoadingState'

import { SocialSignInButtons } from './SocialSignInButtons'

export function SignInForm() {
  const navigate = useNavigate()
  const { isLoaded, signIn, setActive } = useSignIn()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isLoaded) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const attempt = await signIn.create({
        strategy: 'password',
        identifier: email,
        password,
      })

      if (attempt.status === 'complete' && attempt.createdSessionId) {
        await setActive({ session: attempt.createdSessionId })
        navigate('/', { replace: true })
        return
      }

      if (attempt.status === 'needs_second_factor') {
        setErrorMessage('This account requires a second factor. Continue with a second-factor flow.')
        return
      }

      setErrorMessage('Sign in requires additional verification. Please try again.')
    } catch (error: unknown) {
      setErrorMessage(getClerkErrorMessage(error, 'Invalid credentials. Please check and try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoaded) {
    return <LoadingState />
  }

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
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
  )
}
