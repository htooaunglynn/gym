import {
    Users,
    Activity,
    DollarSign,
    UserPlus,
    CheckCircle2,
    Clock,
    AlertCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface KpiStat {
    title: string;
    value: number;
    display: string;
    change: string;
    trend: "up" | "down";
    icon: LucideIcon;
    color: string;
    bgColor: string;
    textColor: string;
}

export interface GrowthPoint {
    month: string;
    members: number;
}

export interface RecentMember {
    name: string;
    email: string;
    plan: string;
    joined: string;
    status: string;
}

export interface ClassEntry {
    name: string;
    trainer: string;
    time: string;
    capacity: number;
    enrolled: number;
    status: string;
}

export interface MembershipPlan {
    plan: string;
    count: number;
    color: string;
    pct: number;
}

export interface ExpiringMembership {
    name: string;
    plan: string;
    daysLeft: number;
}

export interface StatusConfig {
    label: string;
    icon: LucideIcon;
    className: string;
}

export interface ClassStatusConfig {
    label: string;
    className: string;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

export const kpiStats: KpiStat[] = [
    {
        title: "Total Members",
        value: 1284,
        display: "1,284",
        change: "+8.2%",
        trend: "up",
        icon: Users,
        color: "from-violet-500 to-purple-600",
        bgColor: "bg-violet-500/10",
        textColor: "text-violet-600 dark:text-violet-400",
    },
    {
        title: "Active Today",
        value: 93,
        display: "93",
        change: "+14.3%",
        trend: "up",
        icon: Activity,
        color: "from-emerald-500 to-teal-500",
        bgColor: "bg-emerald-500/10",
        textColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
        title: "Monthly Revenue",
        value: 48250,
        display: "$48,250",
        change: "+5.1%",
        trend: "up",
        icon: DollarSign,
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-500/10",
        textColor: "text-blue-600 dark:text-blue-400",
    },
    {
        title: "New Sign-ups",
        value: 37,
        display: "37",
        change: "-2.4%",
        trend: "down",
        icon: UserPlus,
        color: "from-rose-500 to-pink-500",
        bgColor: "bg-rose-500/10",
        textColor: "text-rose-600 dark:text-rose-400",
    },
];

export const memberGrowth: GrowthPoint[] = [
    { month: "Aug", members: 980 },
    { month: "Sep", members: 1050 },
    { month: "Oct", members: 1090 },
    { month: "Nov", members: 1130 },
    { month: "Dec", members: 1200 },
    { month: "Jan", members: 1247 },
    { month: "Feb", members: 1284 },
];

export const recentMembers: RecentMember[] = [
    { name: "Alex Morgan", email: "alex.m@email.com", plan: "Premium", joined: "2h ago", status: "active" },
    { name: "Sam Rivera", email: "sam.r@email.com", plan: "Basic", joined: "5h ago", status: "active" },
    { name: "Jordan Lee", email: "jordan.l@email.com", plan: "Premium", joined: "1d ago", status: "active" },
    { name: "Casey Kim", email: "casey.k@email.com", plan: "Student", joined: "1d ago", status: "pending" },
    { name: "Riley Chen", email: "riley.c@email.com", plan: "Basic", joined: "2d ago", status: "active" },
];

export const todayClasses: ClassEntry[] = [
    { name: "Morning HIIT", trainer: "Mike T.", time: "07:00", capacity: 20, enrolled: 18, status: "ongoing" },
    { name: "Yoga Flow", trainer: "Sarah K.", time: "09:30", capacity: 15, enrolled: 12, status: "upcoming" },
    { name: "Strength Training", trainer: "Jake R.", time: "12:00", capacity: 25, enrolled: 25, status: "full" },
    { name: "Spin Class", trainer: "Emma B.", time: "17:00", capacity: 20, enrolled: 14, status: "upcoming" },
    { name: "Pilates Core", trainer: "Lena W.", time: "19:00", capacity: 12, enrolled: 9, status: "upcoming" },
];

export const membershipBreakdown: MembershipPlan[] = [
    { plan: "Premium", count: 521, color: "bg-violet-500", pct: 40.6 },
    { plan: "Basic", count: 483, color: "bg-blue-500", pct: 37.6 },
    { plan: "Student", count: 196, color: "bg-emerald-500", pct: 15.3 },
    { plan: "Day Pass", count: 84, color: "bg-amber-500", pct: 6.5 },
];

export const expiringMemberships: ExpiringMembership[] = [
    { name: "Pat Williams", plan: "Premium", daysLeft: 3 },
    { name: "Chris Johnson", plan: "Basic", daysLeft: 5 },
    { name: "Dana Scott", plan: "Premium", daysLeft: 7 },
];

export const statusConfig: Record<string, StatusConfig> = {
    active: { label: "Active", icon: CheckCircle2, className: "text-emerald-500 bg-emerald-500/10" },
    pending: { label: "Pending", icon: Clock, className: "text-amber-500 bg-amber-500/10" },
    inactive: { label: "Inactive", icon: AlertCircle, className: "text-rose-500 bg-rose-500/10" },
};

export const classStatusConfig: Record<string, ClassStatusConfig> = {
    ongoing: { label: "Ongoing", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    upcoming: { label: "Upcoming", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    full: { label: "Full", className: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
};
