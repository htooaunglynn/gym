import {
    LayoutDashboard,
    Dumbbell,
    Calendar,
    TrendingUp,
    User,
    Settings,
    Users,
    BarChart3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

export const memberNavItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard/member", icon: LayoutDashboard },
    { label: "Workouts", href: "/dashboard/workouts", icon: Dumbbell },
    { label: "Schedule", href: "/dashboard/schedule", icon: Calendar },
    { label: "Progress", href: "/dashboard/progress", icon: TrendingUp },
    { label: "Profile", href: "/dashboard/profile", icon: User },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export const adminNavItems: NavItem[] = [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Members", href: "/dashboard/admin/members", icon: Users },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
    { label: "Schedules", href: "/dashboard/admin/schedules", icon: Calendar },
    { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

export function getNavItems(role?: string): NavItem[] {
    return role === "ADMIN" ? adminNavItems : memberNavItems;
}
