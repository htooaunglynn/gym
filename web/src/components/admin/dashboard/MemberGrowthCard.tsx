import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { BarChart3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type MemberGrowthCardProps = {
  itemAnimation: Variants
}

export function MemberGrowthCard({ itemAnimation }: MemberGrowthCardProps) {
  return (
    <motion.div variants={itemAnimation} initial="hidden" animate="show" className="lg:col-span-4">
      <Card className="h-full border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
        <CardHeader>
          <CardTitle className="text-lg">Member Growth</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center text-slate-400">
          <div className="text-center">
            <BarChart3 className="mx-auto mb-4 size-12 opacity-10" />
            <p className="text-sm">Revenue and membership charts will be here</p>
            <Badge variant="outline" className="mt-4 border-slate-200 dark:border-white/10">Coming Soon</Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
