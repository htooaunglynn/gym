import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { QuickStat } from "./dashboardData"

type QuickStatsGridProps = {
  quickStats: QuickStat[]
  containerAnimation: Variants
  itemAnimation: Variants
}

export function QuickStatsGrid({
  quickStats,
  containerAnimation,
  itemAnimation
}: QuickStatsGridProps) {
  return (
    <motion.div
      variants={containerAnimation}
      initial="hidden"
      animate="show"
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
    >
      {quickStats.map((stat) => (
        <motion.div key={stat.title} variants={itemAnimation}>
          <Card className="border-white/20 bg-white/60 backdrop-blur-xl transition-all hover:translate-y-[-4px] hover:shadow-lg dark:border-white/10 dark:bg-slate-900/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
              <div className={`rounded-lg p-2 ${stat.iconColor}`}>
                <stat.icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>

              {stat.progress !== undefined && stat.progressLabel ? (
                <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                  <Progress value={stat.progress} className="h-1.5 flex-1" />
                  <span>{stat.progressLabel}</span>
                </div>
              ) : null}

              {stat.trendText && stat.trendIcon ? (
                <p className="mt-1 flex items-center text-xs text-emerald-500">
                  <stat.trendIcon className="mr-1 size-3" />
                  {stat.trendText}
                </p>
              ) : null}

              {stat.subtitle ? <p className="mt-1 text-xs text-slate-500">{stat.subtitle}</p> : null}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
