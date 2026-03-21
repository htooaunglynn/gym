import { create } from 'zustand';
import type { AuthUser } from '@/features/auth/api/auth-api';
import { getMe } from '@/features/auth/api/auth-api';

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    setTokens: (accessToken: string, refreshToken: string) => void;
    setUser: (user: AuthUser) => void;
    login: (accessToken: string, refreshToken: string, user: AuthUser) => void;
    clearAuth: () => void;
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false,
    isLoading: true,

    setTokens: (accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        set({ accessToken, refreshToken });
    },

    setUser: (user) => {
        set({ user, isAuthenticated: true });
    },

    login: (accessToken, refreshToken, user) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        set({ accessToken, refreshToken, user, isAuthenticated: true, isLoading: false });
    },

    clearAuth: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({
            accessToken: null,
            refreshToken: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
        });
    },

    initialize: async () => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (!accessToken || !refreshToken) {
            set({ isLoading: false });
            return;
        }

        set({ accessToken, refreshToken });

        try {
            const user = await getMe();
            set({ user, isAuthenticated: true, isLoading: false });
        } catch {
            get().clearAuth();
        }
    },
}));
