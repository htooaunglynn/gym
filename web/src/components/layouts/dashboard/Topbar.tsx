import { Search, Bell, Menu, LogOut, User } from "lucide-react"
import { useNavigate } from "react-router"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSidebar } from "./SidebarContext"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/layouts/dashboard/Sidebar"
import { useAuthStore } from "@/store/auth-store"
import { logout as logoutApi } from "@/features/auth/api/auth-api"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Topbar() {
    const { toggleSidebar } = useSidebar()
    const navigate = useNavigate()
    const user = useAuthStore((s) => s.user)
    const clearAuth = useAuthStore((s) => s.clearAuth)
    const refreshToken = useAuthStore((s) => s.refreshToken)

    const handleSignOut = async () => {
        try {
            if (refreshToken) await logoutApi(refreshToken)
        } finally {
            clearAuth()
            navigate('/sign-in', { replace: true })
        }
    }

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/20 bg-white/40 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40 sm:px-6">
            <div className="flex items-center gap-4">
                <div className="lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-9 rounded-full">
                                <Menu className="size-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 border-none w-72">
                            <Sidebar isMobile />
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="hidden lg:block">
                    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="size-9 rounded-full">
                        <Menu className="size-5" />
                    </Button>
                </div>

                <div className="relative hidden w-64 md:block lg:w-96">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Search dashboard..."
                        className="h-9 w-full rounded-xl border-none bg-slate-900/5 pl-10 focus-visible:ring-slate-900/10 dark:bg-white/5 dark:focus-visible:ring-white/10"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="ghost" size="icon" className="size-9 rounded-full">
                    <Bell className="size-5" />
                </Button>
                <div className="ml-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-9 rounded-full">
                                <User className="size-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                                {user?.email}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleSignOut}>
                                <LogOut className="mr-2 size-4" />
                                Sign out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
