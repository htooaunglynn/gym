import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { RecentActivity } from "@/types/dashboard"

type RecentActivityCardProps = {
  itemAnimation: Variants
  recentActivity: RecentActivity[]
}

export function RecentActivityCard({ itemAnimation, recentActivity }: RecentActivityCardProps) {
  return (
    <motion.div variants={itemAnimation} initial="hidden" animate="show" className="lg:col-span-3">
      <Card className="h-full border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 dark:text-amber-400">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recentActivity.map((activity) => (
              <div key={`${activity.user.email}-${activity.time}`} className="flex gap-4">
                <Avatar className="size-10 border-2 border-white dark:border-slate-800">
                  <AvatarImage src={activity.user.avatar} />
                  <AvatarFallback className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {activity.user.name
                      .split(" ")
                      .map((namePart) => namePart[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{activity.user.name}</p>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="size-3" />
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{activity.action}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
