import { motion } from "framer-motion"
import { Dumbbell, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function RecentProgress() {
  return (
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
  )
}
