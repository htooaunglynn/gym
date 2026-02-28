"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TOKEN_KEY } from "@/lib/constants";
import { decodeJwt } from "@/lib/jwt";

export interface User {
    id: string;
    email: string;
    name: string | null;
    role: string;
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
