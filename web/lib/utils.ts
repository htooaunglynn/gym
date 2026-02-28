import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Extracts a human-readable string from an API error.
 * Handles both single-string and array-of-strings `message` fields (class-validator).
 */
export function parseApiError(err: unknown, fallback = "Something went wrong"): string {
    const apiErr = err as { message?: string | string[] };
    const msg = apiErr?.message;
    return Array.isArray(msg) ? msg[0] : (msg ?? fallback);
}
