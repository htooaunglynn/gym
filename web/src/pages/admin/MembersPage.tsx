import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  UserPlus, 
  Shield, 
  ShieldCheck,
  ChevronDown
} from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

const members = [
  {
    id: "1",
    name: "Alex Rivera",
    email: "alex@example.com",
    role: "ADMIN",
    status: "active",
    joined: "2024-01-15",
    avatar: ""
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@example.com",
    role: "MEMBER",
    status: "active",
    joined: "2024-02-10",
    avatar: ""
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "MEMBER",
    status: "pending",
    joined: "2024-03-01",
    avatar: ""
  },
  {
    id: "4",
    name: "Lena Meyer",
    email: "lena@example.com",
    role: "MEMBER",
    status: "inactive",
    joined: "2023-11-20",
    avatar: ""
  },
  {
    id: "5",
    name: "David Kim",
    email: "david@example.com",
    role: "MEMBER",
    status: "active",
    joined: "2024-02-28",
    avatar: ""
  }
]

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Members</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your gym members and staff roles.</p>
        </div>
        <Button className="rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900">
          <UserPlus className="mr-2 size-4" />
          Invite User
        </Button>
      </div>

      <Card className="border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 overflow-hidden">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Search by name or email..." 
              className="h-10 pl-10 rounded-xl border-slate-200 dark:border-white/10 bg-white/50 dark:bg-black/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-xl border-slate-200 dark:border-white/10 h-10">
              <Filter className="mr-2 size-4" />
              Filter
              <ChevronDown className="ml-2 size-4 opacity-50" />
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl border-slate-200 dark:border-white/10 h-10">
              Export
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 dark:border-white/10 hover:bg-transparent">
              <TableHead className="w-[300px] text-slate-500 font-semibold h-12 uppercase text-[11px] tracking-wider">Member</TableHead>
              <TableHead className="text-slate-500 font-semibold h-12 uppercase text-[11px] tracking-wider">Role</TableHead>
              <TableHead className="text-slate-500 font-semibold h-12 uppercase text-[11px] tracking-wider">Status</TableHead>
              <TableHead className="text-slate-500 font-semibold h-12 uppercase text-[11px] tracking-wider">Joined</TableHead>
              <TableHead className="text-right text-slate-500 font-semibold h-12 uppercase text-[11px] tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member, idx) => (
              <motion.tr 
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-slate-200 dark:border-white/10 hover:bg-slate-900/5 dark:hover:bg-white/5 group"
              >
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 border-2 border-white dark:border-slate-800 transition-transform group-hover:scale-105">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{member.name}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{member.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {member.role === "ADMIN" ? (
                    <Badge variant="outline" className="rounded-lg bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-400/10 dark:text-indigo-400 dark:border-indigo-400/20 gap-1.5 px-2.5 font-medium">
                      <ShieldCheck className="size-3" />
                      Admin
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="rounded-lg bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-white/10 gap-1.5 px-2.5 font-medium">
                      <Shield className="size-3" />
                      Member
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`size-1.5 rounded-full ${
                      member.status === "active" ? "bg-emerald-500" : 
                      member.status === "pending" ? "bg-amber-500" : "bg-slate-300"
                    }`} />
                    <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">{member.status}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-slate-500 dark:text-slate-400">
                  {new Date(member.joined).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 rounded-full opacity-50 group-hover:opacity-100">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem className="rounded-lg cursor-pointer">View profile</DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg cursor-pointer">Edit details</DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg cursor-pointer flex items-center">
                        <Mail className="mr-2 size-4" />
                        Send message
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-200 dark:bg-white/10" />
                      <DropdownMenuItem className="rounded-lg cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400">Deactivate member</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
