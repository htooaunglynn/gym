import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { 
  Users, 
  Dumbbell, 
  CreditCard, 
  TrendingUp, 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  BarChart3
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const stats = [
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

const recentActivity = [
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back. Here's what's happening at your gym today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200 dark:border-white/10">Export Report</Button>
          <Button className="rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900">
            <Plus className="mr-2 size-4" />
            Add Member
          </Button>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, idx) => (
          <motion.div key={idx} variants={item}>
            <Card className="border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 transition-all hover:translate-y-[-4px] hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</CardTitle>
                <div className={cn("p-2 rounded-lg", stat.color)}>
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
                  <p className={cn(
                    "text-xs font-semibold",
                    stat.trend === "up" ? "text-emerald-500" : "text-red-500"
                  )}>
                    {stat.change}
                  </p>
                  <span className="text-[10px] text-slate-400 ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-7">
        <motion.div 
          variants={item}
          initial="hidden"
          animate="show"
          className="lg:col-span-4"
        >
          <Card className="h-full border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-lg">Member Growth</CardTitle>
            </CardHeader>
            <CardContent className="flex h-[300px] items-center justify-center text-slate-400">
              <div className="text-center">
                <BarChart3 className="mx-auto size-12 opacity-10 mb-4" />
                <p className="text-sm">Revenue and membership charts will be here</p>
                <Badge variant="outline" className="mt-4 border-slate-200 dark:border-white/10">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          variants={item}
          initial="hidden"
          animate="show"
          className="lg:col-span-3"
        >
          <Card className="h-full border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-amber-600 dark:text-amber-400 hover:text-amber-700">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex gap-4">
                    <Avatar className="size-10 border-2 border-white dark:border-slate-800">
                      <AvatarImage src={activity.user.avatar} />
                      <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {activity.user.name.split(" ").map(n => n[0]).join("")}
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
      </div>
    </div>
  )
}


