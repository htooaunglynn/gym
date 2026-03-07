import { SignOutButton, UserButton, useAuth } from '@clerk/react'
import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'
import { Navigate, Link } from 'react-router'

import { Button } from '@/components/ui/button'

export default function HomePage() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return null
  }

  if (isSignedIn) {
    return <Navigate replace to="/admin" />
  }

  return (
    <main className="min-h-dvh bg-[linear-gradient(140deg,#eff6ff_0%,#fffbeb_50%,#f8fafc_100%)] p-4 sm:p-8">
      <motion.section
        className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-4xl flex-col rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:min-h-[calc(100dvh-4rem)] sm:p-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">Welcome back</h1>
            <p className="mt-3 max-w-xl text-sm text-slate-600 sm:text-base">
              Your custom Clerk auth pages are live. Continue building the gym product from this
              protected area.
            </p>
          </div>

          <UserButton />
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-900">Auth routes</h2>
            <p className="mt-2 text-sm text-slate-600">Open these pages to view custom flows.</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link className="text-amber-700 hover:text-amber-800" to="/sign-in">
                  /sign-in
                </Link>
              </li>
              <li>
                <Link className="text-amber-700 hover:text-amber-800" to="/sign-up">
                  /sign-up
                </Link>
              </li>
              <li>
                <Link className="text-amber-700 hover:text-amber-800" to="/forgot-password">
                  /forgot-password
                </Link>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-900">Account actions</h2>
            <p className="mt-2 text-sm text-slate-600">
              Use Clerk components for session-level controls where needed.
            </p>

            <SignOutButton>
              <Button
                className="mt-5 h-10 rounded-xl bg-slate-900 px-4 text-sm hover:bg-slate-800"
                type="button"
              >
                <LogOut className="size-4" />
                Sign out
              </Button>
            </SignOutButton>
          </div>
        </div>
      </motion.section>
    </main>
  )
}
