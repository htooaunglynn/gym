import { SignOutButton } from '@clerk/react'
import { motion } from 'framer-motion'
import { LogOut, LogIn, UserPlus, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

interface AuthActionsProps {
  isSignedIn: boolean
}

export function AuthActions({ isSignedIn }: AuthActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-12 flex w-full flex-col gap-4 sm:flex-row"
    >
      {isSignedIn ? (
        <>
          <Button asChild className="group h-14 flex-1 rounded-2xl bg-slate-900 text-lg font-medium shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl active:scale-[0.98] dark:text-amber-500 dark:hover:text-amber-600">
            <Link to="/admin">
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <SignOutButton>
            <Button variant="outline" className="h-14 flex-1 rounded-2xl border-slate-200 bg-white text-lg font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 active:scale-[0.98]">
              <LogOut className="mr-2 h-5 w-5" />
              Sign Out
            </Button>
          </SignOutButton>
        </>
      ) : (
        <>
          <Button asChild className="group h-14 flex-1 rounded-2xl bg-slate-900 text-lg font-medium shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl active:scale-[0.98] dark:text-amber-500 dark:hover:text-amber-600">
            <Link to="/sign-in">
              <LogIn className="mr-2 h-5 w-5" />
              Sign In
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-14 flex-1 rounded-2xl border-slate-200 bg-white text-lg font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 active:scale-[0.98]">
            <Link to="/sign-up">
              <UserPlus className="mr-2 h-5 w-5" />
              Sign Up
            </Link>
          </Button>
        </>
      )}
    </motion.div>
  )
}
