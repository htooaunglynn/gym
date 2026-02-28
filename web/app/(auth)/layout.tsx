"use client";

import { motion } from "framer-motion";
import { Dumbbell } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            {/* Left panel — branding */}
            <div className="relative hidden items-center justify-center overflow-hidden bg-primary lg:flex">
                {/* Animated background circles */}
                <motion.div
                    className="absolute h-[600px] w-[600px] rounded-full bg-primary-foreground/5"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute h-[400px] w-[400px] rounded-full bg-primary-foreground/5"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [360, 180, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-10 flex flex-col items-center gap-6 px-8 text-center"
                >
                    <motion.div
                        animate={{ rotateY: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
                    >
                        <Dumbbell className="h-20 w-20 text-primary-foreground" strokeWidth={1.5} />
                    </motion.div>

                    <h1 className="text-4xl font-bold tracking-tight text-primary-foreground">
                        GYM
                    </h1>
                    <p className="max-w-sm text-lg text-primary-foreground/70">
                        Track your workouts, crush your goals, and become the best version
                        of yourself.
                    </p>
                </motion.div>
            </div>

            {/* Right panel — form */}
            <div className="flex items-center justify-center p-6 sm:p-12">
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="w-full max-w-md"
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
}
