"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dumbbell,
    LayoutDashboard,
    Calendar,
    TrendingUp,
    User,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Workouts", href: "/dashboard/workouts", icon: Dumbbell },
    { label: "Schedule", href: "/dashboard/schedule", icon: Calendar },
    { label: "Progress", href: "/dashboard/progress", icon: TrendingUp },
    { label: "Profile", href: "/dashboard/profile", icon: User },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const sidebarVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.2 },
    },
};

const navItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
};

function SidebarNav({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
    const pathname = usePathname();

    return (
        <TooltipProvider delayDuration={0}>
            <motion.nav
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-1"
            >
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    const linkContent = (
                        <Link
                            href={item.href}
                            onClick={onNavigate}
                            className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute inset-0 rounded-lg bg-primary"
                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                />
                            )}
                            <Icon className={`relative z-10 h-5 w-5 shrink-0 ${isActive ? "text-primary-foreground" : ""}`} />
                            {!collapsed && <span className="relative z-10">{item.label}</span>}
                            {!collapsed && isActive && (
                                <ChevronRight className="relative z-10 ml-auto h-4 w-4" />
                            )}
                        </Link>
                    );

                    return (
                        <motion.div key={item.href} variants={navItemVariants}>
                            {collapsed ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                                    <TooltipContent side="right">{item.label}</TooltipContent>
                                </Tooltip>
                            ) : (
                                linkContent
                            )}
                        </motion.div>
                    );
                })}
            </motion.nav>
        </TooltipProvider>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading, logout } = useAuth();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <motion.div
                    className="flex flex-col items-center gap-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <Dumbbell className="h-12 w-12 text-primary" strokeWidth={1.5} />
                    </motion.div>
                    <motion.div
                        className="h-1 w-24 overflow-hidden rounded-full bg-muted"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <motion.div
                            className="h-full bg-primary"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : user?.email?.[0]?.toUpperCase() ?? "?";

    return (
        <div className="flex min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="sticky top-0 hidden h-screen w-64 flex-col border-r bg-card lg:flex"
            >
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex items-center gap-3 px-6 py-5">
                        <motion.div
                            whileHover={{ rotate: 15, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <Dumbbell className="h-8 w-8 text-primary" strokeWidth={1.5} />
                        </motion.div>
                        <span className="text-xl font-bold tracking-tight">GYM</span>
                    </div>

                    <Separator />

                    {/* Navigation */}
                    <div className="flex-1 px-3 py-4">
                        <SidebarNav />
                    </div>

                    <Separator />

                    {/* User section */}
                    <div className="p-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 truncate">
                                        <p className="truncate text-sm font-medium">{user?.name ?? "User"}</p>
                                        <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/profile">
                                        <User className="mr-2 h-4 w-4" /> Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/settings">
                                        <Settings className="mr-2 h-4 w-4" /> Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </motion.aside>

            {/* Mobile header + sheet sidebar */}
            <div className="flex flex-1 flex-col">
                <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-card/80 px-4 backdrop-blur-md lg:hidden">
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <AnimatePresence mode="wait">
                                    {mobileOpen ? (
                                        <motion.div
                                            key="close"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <X className="h-5 w-5" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="menu"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Menu className="h-5 w-5" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                            <div className="flex items-center gap-3 px-6 py-5">
                                <Dumbbell className="h-8 w-8 text-primary" strokeWidth={1.5} />
                                <span className="text-xl font-bold tracking-tight">GYM</span>
                            </div>
                            <Separator />
                            <div className="px-3 py-4">
                                <SidebarNav onNavigate={() => setMobileOpen(false)} />
                            </div>
                        </SheetContent>
                    </Sheet>

                    <div className="flex items-center gap-2">
                        <Dumbbell className="h-6 w-6 text-primary" strokeWidth={1.5} />
                        <span className="text-lg font-bold">GYM</span>
                    </div>

                    <div className="ml-auto">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/profile">
                                        <User className="mr-2 h-4 w-4" /> Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Main content area */}
                <main className="flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
