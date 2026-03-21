import type { LucideIcon } from "lucide-react"

export interface DashboardStat {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: LucideIcon
  color: string
}

export type ActivityStatus = "success" | "info" | "error"

export interface RecentActivity {
  user: {
    name: string
    email: string
    avatar: string
  }
  action: string
  time: string
  status: ActivityStatus
}
