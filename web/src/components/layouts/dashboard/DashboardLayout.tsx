import type { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SidebarProvider } from "./SidebarProvider"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"
import { VerificationBanner } from "@/features/dashboard/components/VerificationBanner"

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
            className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-amber-400/10 blur-[100px] dark:bg-amber-400/5"
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-sky-400/10 blur-[120px] dark:bg-sky-400/5"
            animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
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
