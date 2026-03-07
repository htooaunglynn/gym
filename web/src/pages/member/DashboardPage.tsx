import { motion } from "framer-motion"
import { 
  Dumbbell, 
  Flame, 
  Target, 
  Calendar,
  ChevronRight,
  TrendingUp,
  Award
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

export default function MemberDashboardPage() {
  return (
    <div className="space-y-8 pb-10 text-slate-900 dark:text-white">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Member Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Hello, welcome back! Ready for your workout today?</p>
        </motion.div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-400 border-none">
            Elite Member
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={item}>
          <Card className="border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 transition-all hover:translate-y-[-4px] hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Weekly Workouts</CardTitle>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                 <Dumbbell className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4 / 5</div>
              <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                <Progress value={80} className="h-1.5 flex-1" />
                <span>80%</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 transition-all hover:translate-y-[-4px] hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Calories Burned</CardTitle>
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600">
                 <Flame className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,450</div>
              <p className="text-xs text-emerald-500 flex items-center mt-1">
                <TrendingUp className="size-3 mr-1" /> +12% from last week
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 transition-all hover:translate-y-[-4px] hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Current Goal</CardTitle>
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600">
                 <Target className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Muscle Gain</div>
              <p className="text-xs text-slate-500 mt-1">Level 4 reached</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 transition-all hover:translate-y-[-4px] hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Attendance</CardTitle>
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600">
                 <Award className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-slate-500 mt-1">Top 5% in gym</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-7">
        {/* Next Class & Recent Activity */}
        <div className="lg:col-span-4 space-y-8">
           <motion.div variants={item} initial="hidden" animate="show">
              <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl dark:from-slate-900 dark:to-slate-950">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-8 flex-1 space-y-4">
                      <div className="space-y-1">
                        <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none uppercase text-[10px] tracking-widest px-2">Next Scheduled Class</Badge>
                        <h3 className="text-2xl font-bold">Advanced HIIT Training</h3>
                      </div>
                      <div className="flex items-center gap-6 text-slate-300">
                         <div className="flex items-center gap-2">
                            <Calendar className="size-4 text-amber-500" />
                            <span className="text-sm">Today, 5:30 PM</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <Dumbbell className="size-4 text-amber-500" />
                            <span className="text-sm">Studio A</span>
                         </div>
                      </div>
                      <Button className="w-full md:w-auto bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-semibold">
                        View Details
                      </Button>
                    </div>
                    <div className="hidden md:block w-48 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center opacity-80" />
                  </div>
                </CardContent>
              </Card>
           </motion.div>

           <motion.div variants={item} initial="hidden" animate="show">
              <Card className="border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Recent Progress</CardTitle>
                  <Button variant="ghost" size="sm" className="text-amber-600">Full History</Button>
                </CardHeader>
                <CardContent>
                   <div className="space-y-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-slate-950/5 dark:hover:bg-white/5 transition-colors">
                           <div className="flex items-center gap-4">
                              <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                 <Dumbbell className="size-5 text-slate-600 dark:text-slate-400" />
                              </div>
                              <div>
                                 <p className="text-sm font-semibold">Chest & Triceps Session</p>
                                 <p className="text-xs text-slate-500">2 days ago • 1h 15m</p>
                              </div>
                           </div>
                           <ChevronRight className="size-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                        </div>
                      ))}
                   </div>
                </CardContent>
              </Card>
           </motion.div>
        </div>

        {/* Membership & Profile */}
        <div className="lg:col-span-3 space-y-8">
           <motion.div variants={item} initial="hidden" animate="show">
              <Card className="border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500" />
                <CardHeader>
                  <CardTitle className="text-lg">Membership Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Current Plan</span>
                      <span className="font-bold">Elite Monthly</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Next Billing</span>
                      <span className="text-sm font-medium">April 12, 2026</span>
                   </div>
                   <div className="pt-2">
                       <Button variant="outline" className="w-full rounded-xl border-slate-200 dark:border-white/10">Manage Subscription</Button>
                   </div>
                </CardContent>
              </Card>
           </motion.div>

           <motion.div variants={item} initial="hidden" animate="show">
              <Card className="border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Profile</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center space-y-4">
                   <Avatar className="size-24 border-4 border-white shadow-lg dark:border-slate-800 text-slate-900 bg-slate-100">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-2xl">HL</AvatarFallback>
                   </Avatar>
                   <div>
                      <p className="text-xl font-bold">Htoo Aung Lynn</p>
                      <p className="text-sm text-slate-500">htoo@example.com</p>
                   </div>
                   <div className="grid grid-cols-2 gap-4 w-full pt-4">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Height</p>
                         <p className="text-sm font-bold">178 cm</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                         <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Weight</p>
                         <p className="text-sm font-bold">72 kg</p>
                      </div>
                   </div>
                </CardContent>
              </Card>
           </motion.div>
        </div>
      </div>
    </div>
  )
}
