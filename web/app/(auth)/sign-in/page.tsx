"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Eye, EyeOff, Dumbbell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/auth";

const formItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
    }),
};

export default function SignInPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        if (error) setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const data = await authApi.signIn({
                email: form.email,
                password: form.password,
            });

            // Store the token
            localStorage.setItem("access_token", data.access_token);

            router.push("/dashboard");
        } catch (err: unknown) {
            const apiErr = err as { message?: string | string[] };
            const msg = Array.isArray(apiErr.message)
                ? apiErr.message[0]
                : apiErr.message || "Invalid email or password";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* Mobile logo */}
            <motion.div
                className="mb-8 flex items-center gap-2 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <Dumbbell className="h-8 w-8 text-primary" strokeWidth={1.5} />
                <span className="text-xl font-bold">GYM</span>
            </motion.div>

            <motion.div custom={0} variants={formItemVariants} initial="hidden" animate="visible">
                <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
                <p className="mt-2 text-muted-foreground">
                    Sign in to your account to continue
                </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <motion.div custom={1} variants={formItemVariants} initial="hidden" animate="visible" className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={form.email}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="h-11 transition-shadow focus:shadow-md"
                    />
                </motion.div>

                <motion.div custom={2} variants={formItemVariants} initial="hidden" animate="visible" className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            required
                            value={form.password}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="h-11 pr-10 transition-shadow focus:shadow-md"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </motion.div>

                {/* Error message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div custom={3} variants={formItemVariants} initial="hidden" animate="visible">
                    <Button
                        type="submit"
                        className="h-11 w-full text-base font-medium transition-transform active:scale-[0.98]"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <motion.span
                                className="flex items-center gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Signing in...
                            </motion.span>
                        ) : (
                            "Sign in"
                        )}
                    </Button>
                </motion.div>
            </form>

            <motion.p
                custom={4}
                variants={formItemVariants}
                initial="hidden"
                animate="visible"
                className="mt-6 text-center text-sm text-muted-foreground"
            >
                Don&apos;t have an account?{" "}
                <Link
                    href="/sign-up"
                    className="font-medium text-primary underline-offset-4 transition-colors hover:underline"
                >
                    Create one
                </Link>
            </motion.p>
        </motion.div>
    );
}
