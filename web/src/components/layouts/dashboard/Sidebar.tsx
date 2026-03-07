import { Link, useLocation } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import { 
  BarChart3, 
  Users, 
  Dumbbell, 
  CreditCard, 
  Settings, 
  ChevronLeft,
  LayoutDashboard,
  CalendarDays
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./SidebarContext"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

const menuGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Manage",
    items: [
      { label: "Members", href: "/admin/members", icon: Users },
      { label: "Classes", href: "/admin/classes", icon: Dumbbell },
      { label: "Schedule", href: "/admin/schedule", icon: CalendarDays },
      { label: "Payments", href: "/admin/payments", icon: CreditCard },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
]

type SidebarProps = {
  isMobile?: boolean
}

export function Sidebar({ isMobile }: SidebarProps) {
  const location = useLocation()
  const { isCollapsed, toggleSidebar } = useSidebar()

  const sidebarWidth = isCollapsed && !isMobile ? "w-20" : "w-72"

  return (
    <motion.aside
      className={cn(
        "relative flex h-full flex-col border-r border-white/20 bg-white/40 backdrop-blur-xl transition-all duration-300 ease-in-out dark:border-white/10 dark:bg-slate-900/40",
        sidebarWidth,
        isMobile && "w-full"
      )}
      initial={false}
    >
      <div className="flex h-16 items-center border-b border-white/20 px-6 dark:border-white/10">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
             <Dumbbell className="size-5" />
          </div>
          <AnimatePresence mode="wait">
            {(!isCollapsed || isMobile) && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-lg font-bold tracking-tight text-slate-900 dark:text-white"
              >
                GymAdmin
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-8">
          {menuGroups.map((group) => (
            <div key={group.label} className="space-y-4">
              <AnimatePresence mode="wait">
                {(!isCollapsed || isMobile) && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
                  >
                    {group.label}
                  </motion.p>
                )}
              </AnimatePresence>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href
                  const Icon = item.icon
                  
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-slate-900/5 dark:hover:bg-white/5",
                        isActive ? "bg-slate-900/5 text-slate-900 dark:bg-white/5 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      )}
                    >
                      <Icon className={cn("size-5 transition-transform group-hover:scale-110", isActive && "text-amber-600 dark:text-amber-400")} />
                      <AnimatePresence mode="wait">
                        {(!isCollapsed || isMobile) && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="text-[15px] font-medium"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {isActive && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute left-[-4px] h-6 w-1 rounded-full bg-amber-500"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {!isMobile && (
        <div className="p-4 border-t border-white/20 dark:border-white/10">
          <Button
            variant="ghost"
            onClick={toggleSidebar}
            className="w-full flex justify-center h-10 rounded-xl hover:bg-slate-900/5 dark:hover:bg-white/5"
          >
            <ChevronLeft className={cn("size-5 transition-transform duration-300", isCollapsed && "rotate-180")} />
            {!isCollapsed && <span className="ml-2 font-medium">Collapse</span>}
          </Button>
        </div>
      )}
    </motion.aside>
  )
}
