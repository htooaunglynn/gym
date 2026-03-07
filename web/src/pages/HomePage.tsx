import { useAuth } from '@clerk/react'
import { motion, AnimatePresence } from 'framer-motion'

import { HeroSection } from '@/components/home/HeroSection'
import { AuthActions } from '@/components/home/AuthActions'
import { pageTransition } from '@/lib/motion-variants'

export default function HomePage() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return null
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[linear-gradient(140deg,#eff6ff_0%,#fffbeb_50%,#f8fafc_100%)] p-4 sm:p-8">
      <AnimatePresence mode="wait">
        <motion.section
          key={isSignedIn ? 'signed-in' : 'signed-out'}
          variants={pageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/70 p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] backdrop-blur-2xl sm:p-12"
        >
          {/* Decorative background elements */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-100/30 blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-amber-100/30 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

          <HeroSection isSignedIn={isSignedIn} />
          <AuthActions isSignedIn={isSignedIn} />
        </motion.section>
      </AnimatePresence>
    </main>
  )
}
