import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeIn, slideUp } from '@/lib/motion-variants'

type AuthLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[linear-gradient(135deg,#fef7ed_0%,#ffedd5_40%,#dbeafe_100%)] text-slate-900">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-12 h-56 w-56 rounded-full bg-amber-300/40 blur-3xl"
        animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-12 bottom-4 h-72 w-72 rounded-full bg-sky-300/40 blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 14, 0] }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-lg items-center px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <motion.section
          className="z-10 w-full flex items-center"
          variants={slideUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="w-full rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-8">
            <div className="mb-6 space-y-2 sm:mb-7">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Gym</p>
              <h1 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
                {title}
              </h1>
              <p className="text-sm text-slate-600 sm:text-base">{subtitle}</p>
            </div>

            <motion.div 
              variants={fadeIn}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
              className="min-h-[20rem] sm:min-h-[22rem]"
            >
              {children}
            </motion.div>
          </div>
        </motion.section>
      </div>
    </main>
  )
}
