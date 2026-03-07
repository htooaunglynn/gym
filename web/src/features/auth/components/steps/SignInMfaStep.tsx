import { type FormEvent } from 'react'
import { Loader2, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/shared/forms/FormInput'
import { FeedbackMessage } from '@/components/shared/FeedbackMessage'

interface SignInMfaStepProps {
  code: string
  setCode: (value: string) => void
  isSubmitting: boolean
  isResending: boolean
  errorMessage: string
  successMessage: string
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onResend: () => void
  onBack: () => void
}

export function SignInMfaStep({
  code,
  setCode,
  isSubmitting,
  isResending,
  errorMessage,
  successMessage,
  onSubmit,
  onResend,
  onBack,
}: SignInMfaStepProps) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
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

      <div className="space-y-3">
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
          onClick={onResend}
          type="button"
          variant="outline"
        >
          {isResending ? <RotateCw className="size-4 animate-spin" /> : null}
          {isResending ? 'Sending code...' : 'Resend code'}
        </Button>

        <Button
          className="w-full text-slate-500 hover:text-slate-900"
          onClick={onBack}
          type="button"
          variant="ghost"
        >
          Back to sign in
        </Button>
      </div>
    </form>
  )
}
