import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DashboardStat } from "@/types/dashboard"

type DashboardStatsGridProps = {
  stats: DashboardStat[]
  containerAnimation: Variants
  itemAnimation: Variants
}

export function DashboardStatsGrid({
  stats,
  containerAnimation,
  itemAnimation
}: DashboardStatsGridProps) {
  return (
    <motion.div
      variants={containerAnimation}
      initial="hidden"
      animate="show"
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
    >
      {stats.map((stat) => (
        <motion.div key={stat.title} variants={itemAnimation}>
          <Card className="border-white/20 bg-white/60 backdrop-blur-xl transition-all hover:translate-y-[-4px] hover:shadow-lg dark:border-white/10 dark:bg-slate-900/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</CardTitle>
              <div className={cn("rounded-lg p-2", stat.color)}>
                <stat.icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
              <div className="mt-1 flex items-center gap-1">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="size-3 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="size-3 text-red-500" />
                )}
                <p
                  className={cn(
                    "text-xs font-semibold",
                    stat.trend === "up" ? "text-emerald-500" : "text-red-500"
                  )}
                >
                  {stat.change}
                </p>
                <span className="ml-1 text-[10px] text-slate-400">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
