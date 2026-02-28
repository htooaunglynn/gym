const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error(
        "NEXT_PUBLIC_API_URL is not defined. Please add it to your .env.local file."
    );
}

interface ApiError {
    message: string;
    statusCode: number;
}

interface RequestOptions {
    headers?: Record<string, string>;
}

async function request<T>(
    endpoint: string,
    options: RequestInit & RequestOptions = {}
): Promise<T> {
    const { headers, ...rest } = options;

    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        ...rest,
    });

    const data = await res.json();

    if (!res.ok) {
        const error: ApiError = {
            message: data.message || "Something went wrong",
            statusCode: res.status,
        };
        throw error;
    }

    return data as T;
}

export const api = {
    post: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
        request<T>(endpoint, { method: "POST", body: JSON.stringify(body), ...options }),

    get: <T>(endpoint: string, options?: RequestOptions) =>
        request<T>(endpoint, { method: "GET", ...options }),
};
