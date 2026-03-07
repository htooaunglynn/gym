import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight, Download, Filter, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const transactions = [
  { id: "TX-1001", member: "Alex Rivera", amount: "$149.00", status: "completed", date: "Mar 07, 2024", type: "Subscription" },
  { id: "TX-1002", member: "Sarah Chen", amount: "$89.00", status: "completed", date: "Mar 06, 2024", type: "Class Pass" },
  { id: "TX-1003", member: "Mike Johnson", amount: "$149.00", status: "failed", date: "Mar 05, 2024", type: "Subscription" },
  { id: "TX-1004", member: "Lena Meyer", amount: "$199.00", status: "completed", date: "Mar 04, 2024", type: "Personal Training" },
  { id: "TX-1005", member: "David Kim", amount: "$49.00", status: "pending", date: "Mar 03, 2024", type: "Add-on" }
]

export default function PaymentsPage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Payments & Billing</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track gym revenue and member transactions.</p>
        </div>
        <Button className="rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900">
          <Download className="mr-2 size-4" />
          Download Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { title: "Total Revenue", value: "$42,600", trend: "+12%", color: "text-emerald-500" },
          { title: "Pending Payments", value: "$1,450", trend: "-5%", color: "text-amber-500" },
          { title: "Avg. Transaction", value: "$112", trend: "+2%", color: "text-sky-500" }
        ].map((stat, idx) => (
          <Card key={idx} className="border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{stat.value}</div>
               <div className={`mt-1 flex items-center gap-1 text-xs font-semibold ${stat.color}`}>
                 {stat.trend.startsWith("+") ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                 {stat.trend}
               </div>
             </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
             <Input placeholder="Search transactions..." className="pl-10 h-10 rounded-xl" />
           </div>
           <Button variant="outline" size="sm" className="h-10 rounded-xl"><Filter className="mr-2 size-4" /> Filter</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 dark:border-white/10">
              <TableHead className="uppercase text-[11px] tracking-wider font-semibold">Transaction ID</TableHead>
              <TableHead className="uppercase text-[11px] tracking-wider font-semibold">Member</TableHead>
              <TableHead className="uppercase text-[11px] tracking-wider font-semibold">Type</TableHead>
              <TableHead className="uppercase text-[11px] tracking-wider font-semibold">Amount</TableHead>
              <TableHead className="uppercase text-[11px] tracking-wider font-semibold">Status</TableHead>
              <TableHead className="uppercase text-[11px] tracking-wider font-semibold">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx, idx) => (
              <motion.tr 
                key={tx.id} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-slate-100 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
              >
                <TableCell className="font-medium text-xs">{tx.id}</TableCell>
                <TableCell className="font-semibold">{tx.member}</TableCell>
                <TableCell className="text-sm">{tx.type}</TableCell>
                <TableCell className="font-bold">{tx.amount}</TableCell>
                <TableCell>
                  <Badge className={cn(
                    "rounded-lg px-2 py-0.5 font-medium border-0",
                    tx.status === "completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400" :
                    tx.status === "failed" ? "bg-red-100 text-red-700 dark:bg-red-400/10 dark:text-red-400" :
                    "bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400"
                  )}>
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-slate-500">{tx.date}</TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}


