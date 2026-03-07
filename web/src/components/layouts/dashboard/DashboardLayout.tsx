import type { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SidebarProvider } from "./SidebarProvider"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"
import { VerificationBanner } from "@/features/dashboard/components/VerificationBanner"
import { slideUp } from "@/lib/motion-variants"

type DashboardLayoutProps = {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#fef7ed] dark:bg-slate-950">
        {/* Ambient background orbs mirroring auth pages */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -left-24 -top-24 h-[500px] w-[500px] rounded-full bg-amber-300/20 blur-[120px] dark:bg-amber-400/5"
            animate={{ 
              x: [0, 40, 0], 
              y: [0, 60, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-24 bottom-0 h-[600px] w-[600px] rounded-full bg-sky-300/20 blur-[140px] dark:bg-sky-400/5"
            animate={{ 
              x: [0, -60, 0], 
              y: [0, -40, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-pink-300/10 blur-[100px] dark:bg-pink-400/5"
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </div>

        {/* Sidebar for Desktop */}
        <div className="hidden lg:block h-screen sticky top-0">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col relative z-10 w-full overflow-hidden">
          <VerificationBanner />
          <Topbar />
          <main className="flex-1 p-4 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={window.location.pathname}
                variants={slideUp}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="mx-auto max-w-7xl"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
