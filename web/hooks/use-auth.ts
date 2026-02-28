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

export function useAuth({ redirectTo = "/sign-in" }: { redirectTo?: string } = {}) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const accessToken = localStorage.getItem(TOKEN_KEY);

        if (!accessToken) {
            router.replace(redirectTo);
            return;
        }

        const payload = decodeJwt(accessToken);

        if (!payload || payload.exp * 1000 < Date.now()) {
            localStorage.removeItem(TOKEN_KEY);
            router.replace(redirectTo);
            return;
        }

        setUser({
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            role: payload.role,
        });
        setToken(accessToken);
        setIsLoading(false);
    }, [router, redirectTo]);

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        router.replace("/sign-in");
    };

    return { user, isLoading, token, logout };
}
