import { apiClient } from '@/api/client';

export interface AuthUser {
    id: string;
    clerkId: string | null;
    email: string;
    name: string | null;
    role: 'ADMIN' | 'MEMBER';
}

interface AuthResponse {
    data: {
        accessToken: string;
        refreshToken: string;
        user: AuthUser;
    };
}

interface RefreshResponse {
    data: {
        accessToken: string;
    };
}

interface MeResponse {
    data: AuthUser;
}

interface SignUpInput {
    email: string;
    password: string;
    name?: string;
}

export async function signIn(email: string, password: string) {
    const res = await apiClient<AuthResponse>('/auth/sign-in', {
        method: 'POST',
        withAuth: false,
        body: JSON.stringify({ email, password }),
    });
    return res.data;
}

export async function signUp(input: SignUpInput) {
    const res = await apiClient<AuthResponse>('/auth/sign-up', {
        method: 'POST',
        withAuth: false,
        body: JSON.stringify(input),
    });
    return res.data;
}

export async function socialAuth(token: string) {
    const res = await apiClient<AuthResponse>('/auth/social', {
        method: 'POST',
        withAuth: false,
        body: JSON.stringify({ token }),
    });
    return res.data;
}

export async function refreshAccessToken(refreshToken: string) {
    const res = await apiClient<RefreshResponse>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
    });
    return res.data;
}

export async function forgotPassword(email: string) {
    await apiClient('/auth/forgot-password', {
        method: 'POST',
        withAuth: false,
        body: JSON.stringify({ email }),
    });
}

export async function resetPassword(email: string, code: string, newPassword: string) {
    await apiClient('/auth/reset-password', {
        method: 'POST',
        withAuth: false,
        body: JSON.stringify({ email, code, newPassword }),
    });
}

export async function logout(refreshToken: string) {
    await apiClient('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
    });
}

export async function getMe() {
    const res = await apiClient<MeResponse>('/auth/me');
    return res.data;
}
