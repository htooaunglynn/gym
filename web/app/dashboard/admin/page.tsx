"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    UserPlus,
    ArrowUpRight,
    ArrowDownRight,
    AlertCircle,
    Calendar,
    Target,
    RefreshCw,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { containerVariants, itemVariants, scaleIn } from "@/lib/animations";
import {
    kpiStats,
    memberGrowth,
    recentMembers,
    todayClasses,
    membershipBreakdown,
    expiringMemberships,
    statusConfig,
    classStatusConfig,
} from "./_lib/mock-data";
import { AnimatedNumber, GrowthBar } from "./_components/charts";

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const maxMembers = Math.max(...memberGrowth.map((m) => m.members));
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-4 sm:p-6 lg:p-8"
        >
            {/* ── Header ─────────────────────────────────────────────── */}
            <motion.div variants={itemVariants} className="mb-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <motion.h1
                                className="text-3xl font-bold tracking-tight sm:text-4xl"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                Admin{" "}
                                <span className="bg-gradient-to-r from-violet-600 to-purple-400 bg-clip-text text-transparent">
                                    Overview
                                </span>
                            </motion.h1>
                        </div>
                        <motion.p
                            className="mt-1.5 text-sm text-muted-foreground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {dateStr} · Welcome back, {user?.name?.split(" ")[0] ?? "Admin"}
                        </motion.p>
                    </div>
                    <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={handleRefresh}
                        >
                            <motion.span
                                animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
                                transition={refreshing ? { duration: 0.8, ease: "linear", repeat: Infinity } : {}}
                            >
                                <RefreshCw className="h-4 w-4" />
                            </motion.span>
                            Refresh
                        </Button>
                        <Button size="sm" className="gap-2 shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]">
                            <UserPlus className="h-4 w-4" />
                            Add Member
                        </Button>
                    </motion.div>
                </div>
            </motion.div>

            {/* ── KPI Cards ──────────────────────────────────────────── */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {kpiStats.map((stat, i) => {
                    const Icon = stat.icon;
                    const prefix = stat.title === "Monthly Revenue" ? "$" : "";
                    const numericVal = stat.title === "Monthly Revenue" ? 48250 : stat.value;

                    return (
                        <motion.div key={stat.title} variants={scaleIn} custom={i}>
                            <Card className="group relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg">
                                <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${stat.color}`} />
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                            <p className="mt-2 text-3xl font-bold tracking-tight">
                                                <AnimatedNumber value={numericVal} prefix={prefix} />
                                            </p>
                                        </div>
                                        <motion.div
                                            className={`rounded-xl p-2.5 ${stat.bgColor}`}
                                            whileHover={{ scale: 1.12, rotate: 6 }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                        >
                                            <Icon className={`h-5 w-5 ${stat.textColor}`} />
                                        </motion.div>
                                    </div>
                                    <div className="mt-3 flex items-center gap-1 text-sm">
                                        {stat.trend === "up" ? (
                                            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                                        ) : (
                                            <ArrowDownRight className="h-4 w-4 text-rose-500" />
                                        )}
                                        <span className={stat.trend === "up" ? "text-emerald-500" : "text-rose-500"}>
                                            {stat.change}
                                        </span>
                                        <span className="text-muted-foreground">vs last month</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* ── Row 2: Growth Chart + Membership Breakdown ─────────── */}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Member Growth Chart */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Card className="overflow-hidden">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">Member Growth</CardTitle>
                                    <p className="mt-0.5 text-xs text-muted-foreground">Last 7 months</p>
                                </div>
                                <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1.5">
                                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                                    <span className="text-xs font-medium text-emerald-600">+31% YTD</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end justify-around gap-1 pb-2">
                                {memberGrowth.map((item, i) => (
                                    <GrowthBar
                                        key={item.month}
                                        month={item.month}
                                        members={item.members}
                                        maxMembers={maxMembers}
                                        index={i}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Membership Breakdown */}
                <motion.div variants={itemVariants}>
                    <Card className="h-full">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Membership Plans</CardTitle>
                                <Target className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {membershipBreakdown.map((plan, i) => (
                                <motion.div
                                    key={plan.plan}
                                    initial={{ opacity: 0, x: 16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="space-y-1.5"
                                >
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2.5 w-2.5 rounded-full ${plan.color}`} />
                                            <span className="font-medium">{plan.plan}</span>
                                        </div>
                                        <span className="text-muted-foreground">{plan.count.toLocaleString()}</span>
                                    </div>
                                    <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                                        <motion.div
                                            className={`absolute inset-y-0 left-0 rounded-full ${plan.color}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${plan.pct}%` }}
                                            transition={{ delay: 0.5 + i * 0.12, duration: 0.9, ease: "easeOut" }}
                                        />
                                    </div>
                                    <p className="text-right text-xs text-muted-foreground">{plan.pct}%</p>
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* ── Row 3: Recent Members + Today's Classes ─────────────── */}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Recent Members */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Recent Sign-ups</CardTitle>
                                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                                    View All <ArrowUpRight className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {recentMembers.map((member, i) => {
                                    const cfg = statusConfig[member.status as keyof typeof statusConfig];
                                    const StatusIcon = cfg.icon;
                                    const initials = member.name.split(" ").map((n) => n[0]).join("").toUpperCase();
                                    return (
                                        <motion.div
                                            key={member.email}
                                            initial={{ opacity: 0, x: -16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.25 + i * 0.07 }}
                                            whileHover={{ x: 4 }}
                                            className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback className="bg-violet-500/10 text-xs font-semibold text-violet-600">
                                                        {initials}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium">{member.name}</p>
                                                    <p className="text-xs text-muted-foreground">{member.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs">{member.plan}</Badge>
                                                <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.className}`}>
                                                    <StatusIcon className="h-3 w-3" />
                                                    {cfg.label}
                                                </div>
                                                <span className="hidden text-xs text-muted-foreground sm:block">{member.joined}</span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Right column: Today's Classes + Expiring */}
                <div className="flex flex-col gap-6">
                    {/* Today's Classes */}
                    <motion.div variants={itemVariants}>
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">Today&apos;s Classes</CardTitle>
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {todayClasses.map((cls, i) => {
                                    const cfg = classStatusConfig[cls.status as keyof typeof classStatusConfig];
                                    const fillPct = (cls.enrolled / cls.capacity) * 100;
                                    return (
                                        <motion.div
                                            key={cls.name}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + i * 0.07 }}
                                            className="rounded-lg border p-2.5 transition-colors hover:bg-accent"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs font-semibold">{cls.name}</p>
                                                    <p className="text-xs text-muted-foreground">{cls.trainer} · {cls.time}</p>
                                                </div>
                                                <span className={`rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${cfg.className}`}>
                                                    {cfg.label}
                                                </span>
                                            </div>
                                            <div className="mt-1.5 flex items-center gap-2">
                                                <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-muted">
                                                    <motion.div
                                                        className={`absolute inset-y-0 left-0 rounded-full ${fillPct >= 100 ? "bg-rose-500" : "bg-violet-500"}`}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min(fillPct, 100)}%` }}
                                                        transition={{ delay: 0.5 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                                                    />
                                                </div>
                                                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                    {cls.enrolled}/{cls.capacity}
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Expiring Memberships */}
                    <motion.div variants={itemVariants}>
                        <Card className="border-amber-500/30 bg-amber-500/5">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-amber-500" />
                                    <CardTitle className="text-sm text-amber-600 dark:text-amber-400">
                                        Expiring Soon
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {expiringMemberships.map((m, i) => (
                                    <motion.div
                                        key={m.name}
                                        initial={{ opacity: 0, x: 12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + i * 0.08 }}
                                        className="flex items-center justify-between"
                                    >
                                        <div>
                                            <p className="text-xs font-medium">{m.name}</p>
                                            <p className="text-xs text-muted-foreground">{m.plan}</p>
                                        </div>
                                        <span className={`text-xs font-semibold ${m.daysLeft <= 3 ? "text-rose-500" : "text-amber-500"}`}>
                                            {m.daysLeft}d left
                                        </span>
                                    </motion.div>
                                ))}
                                <Button size="sm" variant="outline" className="mt-1 h-7 w-full text-xs border-amber-500/30 text-amber-600 hover:bg-amber-500/10">
                                    Send Renewal Reminders
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
