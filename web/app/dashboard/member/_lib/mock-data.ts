import {
    Flame,
    Dumbbell,
    Timer,
    Zap,
    Trophy,
    Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface MemberStat {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    icon: LucideIcon;
    color: string;
    bgColor: string;
    textColor: string;
}

export interface Workout {
    name: string;
    duration: string;
    calories: number;
    type: string;
    time: string;
    intensity: number;
}

export interface DayActivity {
    day: string;
    value: number;
    label: string;
}

export interface Goal {
    label: string;
    current: number;
    target: number;
    color: string;
}

export interface Achievement {
    title: string;
    description: string;
    icon: LucideIcon;
    earned: boolean;
}

/* ------------------------------------------------------------------ */
/*  Mock data (replace with real API later)                            */
/* ------------------------------------------------------------------ */

export const stats: MemberStat[] = [
    {
        title: "Calories Burned",
        value: "2,847",
        change: "+12.5%",
        trend: "up",
        icon: Flame,
        color: "from-orange-500 to-red-500",
        bgColor: "bg-orange-500/10",
        textColor: "text-orange-600 dark:text-orange-400",
    },
    {
        title: "Workouts Done",
        value: "18",
        change: "+3",
        trend: "up",
        icon: Dumbbell,
        color: "from-blue-500 to-indigo-500",
        bgColor: "bg-blue-500/10",
        textColor: "text-blue-600 dark:text-blue-400",
    },
    {
        title: "Active Minutes",
        value: "842",
        change: "+8.2%",
        trend: "up",
        icon: Timer,
        color: "from-emerald-500 to-teal-500",
        bgColor: "bg-emerald-500/10",
        textColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
        title: "Streak",
        value: "12 days",
        change: "Best: 21",
        trend: "up",
        icon: Zap,
        color: "from-amber-500 to-yellow-500",
        bgColor: "bg-amber-500/10",
        textColor: "text-amber-600 dark:text-amber-400",
    },
];

export const recentWorkouts: Workout[] = [
    { name: "Morning Push Day", duration: "52 min", calories: 380, type: "Strength", time: "Today", intensity: 85 },
    { name: "HIIT Cardio Blast", duration: "35 min", calories: 420, type: "Cardio", time: "Yesterday", intensity: 92 },
    { name: "Back & Biceps", duration: "48 min", calories: 310, type: "Strength", time: "2 days ago", intensity: 78 },
    { name: "Yoga Recovery", duration: "40 min", calories: 150, type: "Flexibility", time: "3 days ago", intensity: 45 },
    { name: "Leg Day Supreme", duration: "58 min", calories: 450, type: "Strength", time: "4 days ago", intensity: 90 },
];

export const weeklyActivity: DayActivity[] = [
    { day: "Mon", value: 85, label: "Push Day" },
    { day: "Tue", value: 60, label: "Cardio" },
    { day: "Wed", value: 0, label: "Rest Day" },
    { day: "Thu", value: 90, label: "Pull Day" },
    { day: "Fri", value: 70, label: "HIIT" },
    { day: "Sat", value: 95, label: "Leg Day" },
    { day: "Sun", value: 40, label: "Yoga" },
];

export const goals: Goal[] = [
    { label: "Weekly Workouts", current: 5, target: 6, color: "bg-blue-500" },
    { label: "Calories Goal", current: 2847, target: 3500, color: "bg-orange-500" },
    { label: "Active Minutes", current: 842, target: 1000, color: "bg-emerald-500" },
];

export const achievements: Achievement[] = [
    { title: "Iron Will", description: "Complete 10 workouts in a row", icon: Trophy, earned: true },
    { title: "Flame Keeper", description: "Burn 2,500+ calories this week", icon: Flame, earned: true },
    { title: "Marathon Man", description: "Log 1,000 active minutes", icon: Target, earned: false },
];
