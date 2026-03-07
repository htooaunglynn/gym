import { useState } from 'react'
import { useUser } from '@clerk/react-router'
import { AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getClerkErrorMessage } from '@/features/auth/utils/clerk-errors'

export function VerificationBanner() {
  const { user } = useUser()
  const [isVerifying, setIsVerifying] = useState(false)
  const [code, setCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (!user || user.primaryEmailAddress?.verification.status === 'verified') {
    return null
  }

  const handleStartVerification = async () => {
    setIsSending(true)
    setError('')
    setSuccess('')
    try {
      await user.primaryEmailAddress?.prepareVerification({ strategy: 'email_code' })
      setIsVerifying(true)
    } catch (err) {
      setError(getClerkErrorMessage(err, 'Failed to send verification code.'))
    } finally {
      setIsSending(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      const result = await user.primaryEmailAddress?.attemptVerification({ code })
      if (result?.verification.status === 'verified') {
        setSuccess('Email verified successfully!')
        setTimeout(() => setIsVerifying(false), 2000)
      }
    } catch (err) {
      setError(getClerkErrorMessage(err, 'Invalid or expired code.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative z-50 overflow-hidden border-b border-amber-200/50 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-950/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center gap-3 py-1">
          <AlertCircle className="size-5 text-amber-600 dark:text-amber-500" />
          <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
            Please verify your email address to secure your account.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isVerifying ? (
            <Button
              onClick={handleStartVerification}
              disabled={isSending}
              size="sm"
              className="h-8 rounded-lg bg-amber-600 px-4 text-xs font-semibold text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
            >
              {isSending ? <Loader2 className="mr-2 size-3 animate-spin" /> : null}
              Verify Now
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <form onSubmit={handleVerifyCode} className="flex items-center gap-2">
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="6-digit code"
                  className="h-8 w-28 rounded-lg border-amber-200 bg-white text-xs focus-visible:ring-amber-500 dark:border-amber-900/50 dark:bg-slate-900"
                  maxLength={6}
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="sm"
                  className="h-8 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  {isSubmitting ? <Loader2 className="mr-2 size-3 animate-spin" /> : null}
                  Submit
                </Button>
              </form>
              <Button
                onClick={() => setIsVerifying(false)}
                variant="ghost"
                size="icon"
                className="size-8 rounded-lg text-slate-400 hover:bg-amber-100 dark:hover:bg-amber-900/30"
              >
                <X className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-amber-200/30 bg-white/50 px-4 py-1.5 dark:border-amber-900/20 dark:bg-slate-900/50"
          >
            <div className="mx-auto flex max-w-7xl items-center gap-2 text-xs font-medium">
              {error ? (
                <>
                  <AlertCircle className="size-3.5 text-red-500" />
                  <span className="text-red-700 dark:text-red-400">{error}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  <span className="text-emerald-700 dark:text-emerald-400">{success}</span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
