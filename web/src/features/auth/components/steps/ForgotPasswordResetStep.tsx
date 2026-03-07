import { type FormEvent } from 'react'
import { Loader2, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/shared/forms/FormInput'
import { FeedbackMessage } from '@/components/shared/FeedbackMessage'
import { ClerkCaptcha } from '../ClerkCaptcha'

interface ForgotPasswordResetStepProps {
  code: string
  setCode: (value: string) => void
  newPassword: string
  setNewPassword: (value: string) => void
  confirmPassword: string
  setConfirmPassword: (value: string) => void
  isSubmitting: boolean
  isResending: boolean
  errorMessage: string
  successMessage: string
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onResend: () => void
}

export function ForgotPasswordResetStep({
  code,
  setCode,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  isSubmitting,
  isResending,
  errorMessage,
  successMessage,
  onSubmit,
  onResend,
}: ForgotPasswordResetStepProps) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <FormInput
        autoComplete="one-time-code"
        label="Password reset code"
        inputMode="numeric"
        maxLength={6}
        onChange={(event) => setCode(event.target.value)}
        placeholder="Enter the 6-digit reset code"
        required
        type="text"
        value={code}
      />

      <FormInput
        autoComplete="new-password"
        label="New password"
        onChange={(event) => setNewPassword(event.target.value)}
        placeholder="Create a new password"
        required
        type="password"
        value={newPassword}
      />

      <FormInput
        autoComplete="new-password"
        label="Confirm new password"
        onChange={(event) => setConfirmPassword(event.target.value)}
        placeholder="Repeat the new password"
        required
        type="password"
        value={confirmPassword}
      />

      <FeedbackMessage text={successMessage} type="success" />
      <FeedbackMessage text={errorMessage} type="error" />
      <ClerkCaptcha />

      <div className="space-y-3">
        <Button
          className="h-11 w-full rounded-xl bg-slate-900 text-base font-medium hover:bg-slate-800"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {isSubmitting ? 'Updating password...' : 'Reset password'}
        </Button>

        <Button
          className="w-full rounded-xl"
          disabled={isResending}
          onClick={onResend}
          type="button"
          variant="outline"
        >
          {isResending ? <RotateCw className="size-4 animate-spin" /> : null}
          {isResending ? 'Resending code...' : 'Resend code'}
        </Button>
      </div>
    </form>
  )
}
