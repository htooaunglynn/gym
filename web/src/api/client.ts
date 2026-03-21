const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';

const BACKEND_API_KEY = import.meta.env.VITE_BACKEND_API_KEY;

type RequestOptions = Omit<RequestInit, 'headers'> & {
    headers?: Record<string, string>;
    withAuth?: boolean;
};

let refreshPromise: Promise<string | null> | null = null;

async function tryRefreshToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(BACKEND_API_KEY ? { 'x-api-key': BACKEND_API_KEY } : {}),
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            return null;
        }

        const data = (await res.json()) as { data?: { accessToken?: string }; accessToken?: string };
        const newToken = data.data?.accessToken ?? data.accessToken;
        if (newToken) {
            localStorage.setItem('accessToken', newToken);
            return newToken;
        }
        return null;
    } catch {
        return null;
    } finally {
        refreshPromise = null;
    }
}

export async function apiClient<T = unknown>(
    path: string,
    options: RequestOptions = {},
): Promise<T> {
    const accessToken = localStorage.getItem('accessToken');
    const withAuth = options.withAuth ?? true;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(BACKEND_API_KEY ? { 'x-api-key': BACKEND_API_KEY } : {}),
        ...(withAuth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options.headers,
    };

    let res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

    // Auto-refresh on 401
    if (res.status === 401 && withAuth && accessToken) {
        if (!refreshPromise) {
            refreshPromise = tryRefreshToken();
        }
        const newToken = await refreshPromise;

        if (newToken) {
            headers.Authorization = `Bearer ${newToken}`;
            res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
        }
    }

    if (!res.ok) {
        const body = await res.json().catch(() => null) as { message?: string } | null;
        throw new Error(body?.message ?? `Request failed with status ${res.status}`);
    }

    return res.json() as Promise<T>;
}
