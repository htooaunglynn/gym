import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Member Dashboard</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Hello, welcome back! Ready for your workout today?</p>
      </motion.div>
      <div className="flex items-center gap-3">
        <Badge
          variant="secondary"
          className="rounded-full border-none bg-amber-100 px-3 py-1 text-amber-900 dark:bg-amber-900/30 dark:text-amber-400"
        >
          Elite Member
        </Badge>
      </div>
    </div>
  )
}
