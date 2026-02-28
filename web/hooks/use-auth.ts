"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TOKEN_KEY } from "@/lib/constants";

export interface User {
    id: string;
    email: string;
    name: string | null;
    role: string;
}

interface TokenPayload {
    sub: string;
    email: string;
    name: string | null;
    role: string;
    iat: number;
    exp: number;
}

function decodeJwt(token: string): TokenPayload | null {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
}

function getInitialAuthState(): AuthState {
    if (typeof window === "undefined") return { user: null, token: null, isLoading: true };

    const accessToken = localStorage.getItem(TOKEN_KEY);
    if (!accessToken) return { user: null, token: null, isLoading: false };

    const payload = decodeJwt(accessToken);
    if (!payload || payload.exp * 1000 < Date.now()) {
        localStorage.removeItem(TOKEN_KEY);
        return { user: null, token: null, isLoading: false };
    }

    return {
        user: { id: payload.sub, email: payload.email, name: payload.name, role: payload.role },
        token: accessToken,
        isLoading: false,
    };
}

export function useAuth({ redirectTo = "/sign-in" }: { redirectTo?: string } = {}) {
    const router = useRouter();
    const [authState] = useState<AuthState>(getInitialAuthState);

    useEffect(() => {
        if (!authState.isLoading && !authState.user) {
            router.replace(redirectTo);
        }
    }, [authState.isLoading, authState.user, router, redirectTo]);

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        router.replace("/sign-in");
    };

    return { user: authState.user, isLoading: authState.isLoading, token: authState.token, logout };
}
