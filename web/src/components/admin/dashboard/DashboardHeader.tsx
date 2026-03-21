import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Welcome back. Here's what's happening at your gym today.</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="rounded-xl border-slate-200 dark:border-white/10">Export Report</Button>
        <Button className="rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900">
          <Plus className="mr-2 size-4" />
          Add Member
        </Button>
      </div>
    </div>
  )
}
