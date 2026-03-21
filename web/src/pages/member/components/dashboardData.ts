import type { Variants } from "framer-motion"
import { Award, Dumbbell, Flame, Target, TrendingUp } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type QuickStat = {
  title: string
  value: string
  subtitle?: string
  progress?: number
  progressLabel?: string
  trendText?: string
  icon: LucideIcon
  iconColor: string
  trendIcon?: LucideIcon
}

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

export const quickStats: QuickStat[] = [
  {
    title: "Weekly Workouts",
    value: "4 / 5",
    progress: 80,
    progressLabel: "80%",
    icon: Dumbbell,
    iconColor: "bg-amber-500/10 text-amber-600"
  },
  {
    title: "Calories Burned",
    value: "12,450",
    trendText: "+12% from last week",
    trendIcon: TrendingUp,
    icon: Flame,
    iconColor: "bg-orange-500/10 text-orange-600"
  },
  {
    title: "Current Goal",
    value: "Muscle Gain",
    subtitle: "Level 4 reached",
    icon: Target,
    iconColor: "bg-sky-500/10 text-sky-600"
  },
  {
    title: "Attendance",
    value: "92%",
    subtitle: "Top 5% in gym",
    icon: Award,
    iconColor: "bg-indigo-500/10 text-indigo-600"
  }
]
