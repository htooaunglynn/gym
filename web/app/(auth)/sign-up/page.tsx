"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Eye, EyeOff, CheckCircle2, Dumbbell } from "lucide-react";

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

export default function SignUpPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
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
            await authApi.signUp({
                email: form.email,
                password: form.password,
                name: form.name || undefined,
            });

            setSuccess(true);
            setTimeout(() => router.push("/sign-in"), 1500);
        } catch (err: unknown) {
            const apiErr = err as { message?: string | string[] };
            const msg = Array.isArray(apiErr.message)
                ? apiErr.message[0]
                : apiErr.message || "Something went wrong";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const passwordStrength =
        form.password.length === 0
            ? 0
            : form.password.length < 6
                ? 1
                : form.password.length < 10
                    ? 2
                    : 3;

    const strengthColors = ["", "bg-red-500", "bg-yellow-500", "bg-green-500"];
    const strengthLabels = ["", "Weak", "Fair", "Strong"];

    return (
        <AnimatePresence mode="wait">
            {success ? (
                <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4 text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                    >
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </motion.div>
                    <h2 className="text-2xl font-bold">Account Created!</h2>
                    <p className="text-muted-foreground">Redirecting you to sign in...</p>
                </motion.div>
            ) : (
                <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
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
                        <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
                        <p className="mt-2 text-muted-foreground">
                            Enter your details below to get started
                        </p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <motion.div custom={1} variants={formItemVariants} initial="hidden" animate="visible" className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="John Doe"
                                value={form.name}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="h-11 transition-shadow focus:shadow-md"
                            />
                        </motion.div>

                        <motion.div custom={2} variants={formItemVariants} initial="hidden" animate="visible" className="space-y-2">
                            <Label htmlFor="email">
                                Email <span className="text-destructive">*</span>
                            </Label>
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

                        <motion.div custom={3} variants={formItemVariants} initial="hidden" animate="visible" className="space-y-2">
                            <Label htmlFor="password">
                                Password <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min 8 characters"
                                    required
                                    minLength={8}
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

                            {/* Password strength indicator */}
                            <AnimatePresence>
                                {form.password.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-1.5 pt-1"
                                    >
                                        <div className="flex gap-1">
                                            {[1, 2, 3].map((level) => (
                                                <motion.div
                                                    key={level}
                                                    className={`h-1.5 flex-1 rounded-full ${passwordStrength >= level
                                                            ? strengthColors[passwordStrength]
                                                            : "bg-muted"
                                                        }`}
                                                    initial={{ scaleX: 0 }}
                                                    animate={{ scaleX: 1 }}
                                                    transition={{ delay: level * 0.1, duration: 0.3 }}
                                                    style={{ transformOrigin: "left" }}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {strengthLabels[passwordStrength]}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
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

                        <motion.div custom={4} variants={formItemVariants} initial="hidden" animate="visible">
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
                                        Creating account...
                                    </motion.span>
                                ) : (
                                    "Create account"
                                )}
                            </Button>
                        </motion.div>
                    </form>

                    <motion.p
                        custom={5}
                        variants={formItemVariants}
                        initial="hidden"
                        animate="visible"
                        className="mt-6 text-center text-sm text-muted-foreground"
                    >
                        Already have an account?{" "}
                        <Link
                            href="/sign-in"
                            className="font-medium text-primary underline-offset-4 transition-colors hover:underline"
                        >
                            Sign in
                        </Link>
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
