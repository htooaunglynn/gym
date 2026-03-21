import { motion } from "framer-motion"
import { Calendar, Dumbbell } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function NextClass() {
  return (
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
  )
}
