"use client";

import { motion } from "framer-motion";

/**
 * Vertical bar for the weekly activity chart.
 */
export function ActivityBar({ day, value, index }: { day: string; value: number; label: string; index: number }) {
    return (
        <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
        >
            <div className="relative h-28 w-8 overflow-hidden rounded-full bg-muted">
                <motion.div
                    className={`absolute bottom-0 w-full rounded-full ${value === 0
                        ? "bg-muted-foreground/20"
                        : value > 80
                            ? "bg-gradient-to-t from-emerald-500 to-teal-400"
                            : value > 50
                                ? "bg-gradient-to-t from-blue-500 to-indigo-400"
                                : "bg-gradient-to-t from-amber-500 to-yellow-400"
                        }`}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(value, 5)}%` }}
                    transition={{ delay: 0.5 + index * 0.08, duration: 0.7, ease: "easeOut" }}
                />
            </div>
            <span className="text-xs font-medium text-muted-foreground">{day}</span>
        </motion.div>
    );
}
