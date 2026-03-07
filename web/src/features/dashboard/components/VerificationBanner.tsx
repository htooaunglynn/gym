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
    <div className="relative z-50 overflow-hidden border-b border-indigo-200/30 bg-white/60 backdrop-blur-md dark:border-indigo-950/30 dark:bg-slate-950/60">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-sky-500/5 to-indigo-500/5" />
      
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center gap-4 py-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
            <AlertCircle className="size-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Account Security
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Please verify your email address to secure your account.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isVerifying ? (
            <Button
              onClick={handleStartVerification}
              disabled={isSending}
              size="sm"
              className="group relative h-9 overflow-hidden rounded-xl bg-slate-900 px-5 text-xs font-bold text-white transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 dark:bg-indigo-600 dark:hover:bg-indigo-500"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isSending ? <Loader2 className="size-3.5 animate-spin" /> : null}
                Verify Now
              </span>
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <form onSubmit={handleVerifyCode} className="flex items-center gap-2">
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="6-digit code"
                  className="h-9 w-32 rounded-xl border-slate-200 bg-white/50 text-center text-xs font-bold tracking-[0.2em] transition-all focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20 dark:border-indigo-900/50 dark:bg-slate-900/50"
                  maxLength={6}
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="sm"
                  className="h-9 rounded-xl bg-indigo-600 px-5 text-xs font-bold text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"
                >
                  {isSubmitting ? <Loader2 className="mr-2 size-3.5 animate-spin" /> : null}
                  Confirm
                </Button>
              </form>
              <Button
                onClick={() => setIsVerifying(false)}
                variant="ghost"
                size="icon"
                className="size-9 rounded-xl text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/40 dark:hover:text-indigo-400"
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
            className="border-t border-indigo-100/50 bg-white/30 dark:border-indigo-900/20 dark:bg-slate-900/30"
          >
            <div className="mx-auto flex max-w-7xl items-center gap-2.5 px-4 py-2 sm:px-6 lg:px-8 text-xs font-bold">
              {error ? (
                <>
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
                    <AlertCircle className="size-3 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-red-600 dark:text-red-400">{error}</span>
                </>
              ) : (
                <>
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                    <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400">{success}</span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
