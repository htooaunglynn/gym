import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function MembershipStatus() {
  return (
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
  )
}
