import { api, type ApiEnvelope } from "./api";

export interface AuthResponse {
    accessToken: string;
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
        api.post<ApiEnvelope<AuthResponse>>("/auth/sign-up", payload).then((res) => res.data),

    signIn: (payload: SignInPayload) =>
        api.post<ApiEnvelope<AuthResponse>>("/auth/sign-in", payload).then((res) => res.data),
};
