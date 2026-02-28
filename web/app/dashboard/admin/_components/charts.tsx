"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * Animated counter that increments from 0 to the target value.
 */
export function AnimatedNumber({ value, prefix = "" }: { value: number; prefix?: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const duration = 1200;
        const steps = 60;
        const increment = value / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);
        return () => clearInterval(timer);
    }, [value]);

    return (
        <>
            {prefix}
            {count.toLocaleString()}
        </>
    );
}

/**
 * Vertical bar for the member growth chart.
 */
export function GrowthBar({ month, members, maxMembers, index }: { month: string; members: number; maxMembers: number; index: number }) {
    const pct = (members / maxMembers) * 100;
    return (
        <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.06, duration: 0.4 }}
        >
            <span className="text-xs font-medium text-muted-foreground">{members.toLocaleString()}</span>
            <div className="relative h-32 w-9 overflow-hidden rounded-full bg-muted">
                <motion.div
                    className="absolute bottom-0 w-full rounded-full bg-gradient-to-t from-violet-600 to-purple-400"
                    initial={{ height: 0 }}
                    animate={{ height: `${pct}%` }}
                    transition={{ delay: 0.4 + index * 0.07, duration: 0.8, ease: "easeOut" }}
                />
            </div>
            <span className="text-xs text-muted-foreground">{month}</span>
        </motion.div>
    );
}
