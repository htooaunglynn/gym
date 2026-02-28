"use client";

import { motion } from "framer-motion";
import {
    Flame,
    Dumbbell,
    Zap,
    Trophy,
    Target,
    ArrowUpRight,
    ArrowDownRight,
    ChevronRight,
    Play,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { containerVariants, itemVariants, scaleIn } from "@/lib/animations";
import {
    stats,
    recentWorkouts,
    weeklyActivity,
    goals,
    achievements,
} from "./_lib/mock-data";
import { ActivityBar } from "./_components/activity-bar";

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function MemberDashboardPage() {
    const { user } = useAuth();

    const greeting = (() => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    })();

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-4 sm:p-6 lg:p-8"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="mb-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <motion.h1
                            className="text-3xl font-bold tracking-tight sm:text-4xl"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {greeting},{" "}
                            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                {user?.name?.split(" ")[0] ?? "Champ"}
                            </span>
                            {" "}💪
                        </motion.h1>
                        <motion.p
                            className="mt-1.5 text-muted-foreground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Here&apos;s your fitness overview for this week
                        </motion.p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Button size="lg" className="gap-2 shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">
                            <Play className="h-4 w-4" />
                            Start Workout
                        </Button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div key={stat.title} variants={scaleIn} custom={i}>
                            <Card className="group relative overflow-hidden transition-shadow hover:shadow-lg">
                                {/* Gradient accent line */}
                                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.color}`} />

                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                            <p className="mt-2 text-3xl font-bold tracking-tight">{stat.value}</p>
                                        </div>
                                        <motion.div
                                            className={`rounded-xl p-2.5 ${stat.bgColor}`}
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                        >
                                            <Icon className={`h-5 w-5 ${stat.textColor}`} />
                                        </motion.div>
                                    </div>
                                    <div className="mt-3 flex items-center gap-1 text-sm">
                                        {stat.trend === "up" ? (
                                            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                                        ) : (
                                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                                        )}
                                        <span className={stat.trend === "up" ? "text-emerald-500" : "text-red-500"}>
                                            {stat.change}
                                        </span>
                                        <span className="text-muted-foreground">vs last week</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Activity Chart */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Card className="overflow-hidden">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Weekly Activity</CardTitle>
                                <Tabs defaultValue="week">
                                    <TabsList className="h-8">
                                        <TabsTrigger value="week" className="text-xs">Week</TabsTrigger>
                                        <TabsTrigger value="month" className="text-xs">Month</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end justify-around gap-2">
                                {weeklyActivity.map((item, i) => (
                                    <ActivityBar
                                        key={item.day}
                                        day={item.day}
                                        value={item.value}
                                        label={item.label}
                                        index={i}
                                    />
                                ))}
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400" />
                                    High Intensity
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-400" />
                                    Medium
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400" />
                                    Low
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Goals Card */}
                <motion.div variants={itemVariants}>
                    <Card className="h-full">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Weekly Goals</CardTitle>
                                <Target className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {goals.map((goal, i) => {
                                const pct = Math.round((goal.current / goal.target) * 100);
                                return (
                                    <motion.div
                                        key={goal.label}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + i * 0.1 }}
                                        className="space-y-2"
                                    >
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium">{goal.label}</span>
                                            <span className="text-muted-foreground">
                                                {goal.current.toLocaleString()}/{goal.target.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <Progress value={0} className="h-2" />
                                            <motion.div
                                                className={`absolute inset-y-0 left-0 rounded-full ${goal.color}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(pct, 100)}%` }}
                                                transition={{ delay: 0.6 + i * 0.15, duration: 0.8, ease: "easeOut" }}
                                                style={{ height: "100%" }}
                                            />
                                        </div>
                                        <p className="text-right text-xs text-muted-foreground">{pct}%</p>
                                    </motion.div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Bottom Section */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Recent Workouts */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Recent Workouts</CardTitle>
                                <Button variant="ghost" size="sm" className="gap-1 text-sm">
                                    View All <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentWorkouts.map((workout, i) => (
                                    <motion.div
                                        key={workout.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.08 }}
                                        whileHover={{ x: 4, backgroundColor: "var(--accent)" }}
                                        className="flex items-center justify-between rounded-lg border p-3.5 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <motion.div
                                                className={`flex h-10 w-10 items-center justify-center rounded-lg ${workout.type === "Strength"
                                                    ? "bg-blue-500/10 text-blue-500"
                                                    : workout.type === "Cardio"
                                                        ? "bg-red-500/10 text-red-500"
                                                        : "bg-purple-500/10 text-purple-500"
                                                    }`}
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                {workout.type === "Strength" ? (
                                                    <Dumbbell className="h-5 w-5" />
                                                ) : workout.type === "Cardio" ? (
                                                    <Flame className="h-5 w-5" />
                                                ) : (
                                                    <Zap className="h-5 w-5" />
                                                )}
                                            </motion.div>
                                            <div>
                                                <p className="text-sm font-medium">{workout.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {workout.duration} · {workout.calories} cal · {workout.time}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={
                                                    workout.type === "Strength"
                                                        ? "default"
                                                        : workout.type === "Cardio"
                                                            ? "destructive"
                                                            : "secondary"
                                                }
                                                className="text-xs"
                                            >
                                                {workout.type}
                                            </Badge>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Achievements */}
                <motion.div variants={itemVariants}>
                    <Card className="h-full">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Achievements</CardTitle>
                                <Trophy className="h-5 w-5 text-amber-500" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {achievements.map((achievement, i) => {
                                const Icon = achievement.icon;
                                return (
                                    <motion.div
                                        key={achievement.title}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 + i * 0.1 }}
                                        className={`flex items-start gap-3 rounded-lg border p-3.5 transition-all ${achievement.earned
                                            ? "border-amber-500/30 bg-amber-500/5"
                                            : "opacity-60"
                                            }`}
                                    >
                                        <motion.div
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${achievement.earned
                                                ? "bg-amber-500/10 text-amber-500"
                                                : "bg-muted text-muted-foreground"
                                                }`}
                                            whileHover={
                                                achievement.earned
                                                    ? { rotate: [0, -10, 10, 0], scale: 1.1 }
                                                    : {}
                                            }
                                        >
                                            <Icon className="h-4 w-4" />
                                        </motion.div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium">{achievement.title}</p>
                                                {achievement.earned && (
                                                    <motion.span
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{
                                                            delay: 0.8 + i * 0.1,
                                                            type: "spring",
                                                            stiffness: 500,
                                                        }}
                                                        className="text-xs"
                                                    >
                                                        ✨
                                                    </motion.span>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {achievement.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
