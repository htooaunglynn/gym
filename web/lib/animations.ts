import type { Variants } from "framer-motion";

/**
 * Shared Framer Motion variants used across auth form pages.
 * Each item fades in upward with a staggered delay based on the `custom` index.
 */
export const formItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
        },
    }),
};

/** Staggered container — children animate in one after another. */
export const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

/** Fade-up item — used as a direct child of `containerVariants`. */
export const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

/** Scale-in item — used for cards that should pop into view. */
export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};
