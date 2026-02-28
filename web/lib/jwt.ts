/**
 * Decoded JWT payload shape used across the app.
 */
export interface TokenPayload {
    sub: string;
    email: string;
    name: string | null;
    role: string;
    iat: number;
    exp: number;
}

/**
 * Decode a JWT token without verifying the signature (client-side only).
 * Returns `null` if the token is malformed.
 */
export function decodeJwt(token: string): TokenPayload | null {
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

/**
 * Extract the `role` claim from a JWT token.
 * Returns `null` if the token is malformed or has no role.
 */
export function getRoleFromToken(token: string): string | null {
    const payload = decodeJwt(token);
    return payload?.role ?? null;
}
