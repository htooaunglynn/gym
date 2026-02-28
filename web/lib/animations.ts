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
