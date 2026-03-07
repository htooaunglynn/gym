import { type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/shared/forms/FormInput'
import { FeedbackMessage } from '@/components/shared/FeedbackMessage'
import { ClerkCaptcha } from '../ClerkCaptcha'

interface ForgotPasswordRequestStepProps {
  email: string
  setEmail: (value: string) => void
  isSubmitting: boolean
  errorMessage: string
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function ForgotPasswordRequestStep({
  email,
  setEmail,
  isSubmitting,
  errorMessage,
  onSubmit,
}: ForgotPasswordRequestStepProps) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
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
      <ClerkCaptcha />

      <Button
        className="h-11 w-full rounded-xl bg-slate-900 text-base font-medium hover:bg-slate-800"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
        {isSubmitting ? 'Sending code...' : 'Send reset code'}
      </Button>
    </form>
  )
}
