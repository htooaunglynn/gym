import { api } from "./api";

export interface AuthResponse {
    access_token: string;
}

export interface SignUpPayload {
    email: string;
    password: string;
    name?: string;
}

export interface SignInPayload {
    email: string;
    password: string;
}

export const authApi = {
    signUp: (payload: SignUpPayload) =>
        api.post<AuthResponse>("/auth/sign-up", payload),

    signIn: (payload: SignInPayload) =>
        api.post<AuthResponse>("/auth/sign-in", payload),
};
