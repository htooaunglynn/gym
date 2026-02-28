"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { getNavItems } from "../_lib/nav-items";

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

interface SidebarNavProps {
    collapsed?: boolean;
    onNavigate?: () => void;
    role?: string;
}

export function SidebarNav({ collapsed, onNavigate, role }: SidebarNavProps) {
    const pathname = usePathname();
    const navItems = getNavItems(role);

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
