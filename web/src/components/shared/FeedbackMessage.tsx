import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { fadeIn } from '@/lib/motion-variants'

type FeedbackMessageProps = {
  type: 'error' | 'success'
  text: string
}

export function FeedbackMessage({ type, text }: FeedbackMessageProps) {
  return (
    <AnimatePresence>
      {text && (
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          exit="exit"
          className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
            type === 'error'
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {type === 'error' ? (
            <AlertCircle className="size-4 shrink-0" />
          ) : (
            <CheckCircle2 className="size-4 shrink-0" />
          )}
          <span>{text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
