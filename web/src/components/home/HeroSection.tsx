import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import { useUser } from '@clerk/react'
import { springTransition } from '@/lib/motion-variants'

interface HeroSectionProps {
  isSignedIn: boolean
}

export function HeroSection({ isSignedIn }: HeroSectionProps) {
  const { user } = useUser()

  return (
    <div className="relative z-10 flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={springTransition}
        className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-slate-900 shadow-xl shadow-slate-900/20"
      >
        <User className="h-10 w-10 text-white" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8"
      >
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          {isSignedIn ? (
            <>
              Welcome back,<br />
              <span className="bg-[linear-gradient(to_right,#0f172a,#334155)] bg-clip-text text-transparent">
                {user?.firstName || 'Friend'}
              </span>
            </>
          ) : (
            <>
              Elevate Your<br />
              <span className="bg-[linear-gradient(to_right,#0f172a,#334155)] bg-clip-text text-transparent">
                Fitness Journey
              </span>
            </>
          )}
        </h1>
        <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
          {isSignedIn
            ? 'Great to see you again! Your personalized training dashboard is ready for you.'
            : 'Join our exclusive gym community and experience a new standard of health and performance.'}
        </p>
      </motion.div>
    </div>
  )
}
