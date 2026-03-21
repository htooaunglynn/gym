import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function QuickProfile() {
  return (
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
  )
}
