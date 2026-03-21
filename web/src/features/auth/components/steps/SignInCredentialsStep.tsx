import { type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/shared/forms/FormInput'
import { FeedbackMessage } from '@/components/shared/FeedbackMessage'
import { SocialSignInButtons } from '../SocialSignInButtons'

interface SignInCredentialsStepProps {
    email: string
    setEmail: (value: string) => void
    password: string
    setPassword: (value: string) => void
    isSubmitting: boolean
    errorMessage: string
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
    onSocialError: (message: string) => void
}

export function SignInCredentialsStep({
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    errorMessage,
    onSubmit,
    onSocialError,
}: SignInCredentialsStepProps) {
    return (
        <div className="space-y-5">
            <SocialSignInButtons disabled={isSubmitting} onError={onSocialError} />

            <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                <span>or use email</span>
                <span className="h-px flex-1 bg-slate-200" />
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
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
                    className="h-11 w-full rounded-xl bg-slate-900 text-base font-medium hover:bg-slate-800 dark:text-amber-500 dark:hover:text-amber-600"
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
                <Link className="font-medium text-amber-700 transition dark:text-amber-500 dark:hover:text-amber-600 hover:text-amber-800" to="/sign-up">
                    Create account
                </Link>
            </div>
        </div>
    )
}
