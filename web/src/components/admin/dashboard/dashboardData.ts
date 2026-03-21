import { Users, Dumbbell, CreditCard, TrendingUp } from "lucide-react"
import type { Variants } from "framer-motion"

import type { DashboardStat, RecentActivity } from "@/types/dashboard"

export const stats: DashboardStat[] = [
  {
    title: "Total Members",
    value: "2,543",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400"
  },
  {
    title: "Active Classes",
    value: "48",
    change: "+4",
    trend: "up",
    icon: Dumbbell,
    color: "bg-sky-500/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-400"
  },
  {
    title: "Monthly Revenue",
    value: "$42,600",
    change: "+18.2%",
    trend: "up",
    icon: CreditCard,
    color: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400"
  },
  {
    title: "Retention Rate",
    value: "94%",
    change: "-0.5%",
    trend: "down",
    icon: TrendingUp,
    color: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400"
  }
]

export const recentActivity: RecentActivity[] = [
  {
    user: { name: "Alex Rivera", email: "alex@example.com", avatar: "" },
    action: "Signed up for Elite Membership",
    time: "2 hours ago",
    status: "success"
  },
  {
    user: { name: "Sarah Chen", email: "sarah@example.com", avatar: "" },
    action: "Joined Yoga Morning Class",
    time: "4 hours ago",
    status: "info"
  },
  {
    user: { name: "Mike Johnson", email: "mike@example.com", avatar: "" },
    action: "Payment of $149 failed",
    time: "6 hours ago",
    status: "error"
  }
]

export const containerAnimation: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const itemAnimation: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}
