import { motion } from 'framer-motion'

const dots = [0, 1, 2]

export type LoadingStateProps = {
  title?: string
  subtitle?: string
  loadingText?: string
}

export function LoadingState({
  title = 'Please wait',
  subtitle = 'Processing your request...',
  loadingText = 'Loading',
}: LoadingStateProps) {
  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="space-y-2">
        <p className="text-base font-semibold text-slate-900">{title}</p>
        <p className="text-sm text-slate-600">{subtitle}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
        <div className="mb-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(90deg,#f59e0b,#38bdf8)]"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
          />
        </div>

        <div className="flex items-center gap-2">
          {dots.map((dot) => (
            <motion.span
              key={dot}
              className="size-2 rounded-full bg-slate-400"
              animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, delay: dot * 0.15 }}
            />
          ))}
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            {loadingText}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
