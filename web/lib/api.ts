const getApiUrl = () => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (!url) {
        throw new Error(
            "NEXT_PUBLIC_API_URL is not defined. Please add it to your .env.local file."
        );
    }
    return url;
};

interface ApiError {
    message: string;
    statusCode: number;
}

interface RequestOptions {
    headers?: Record<string, string>;
}

/** Shape returned by cursor-paginated endpoints. */
export interface PaginatedResponse<T> {
    statusCode: number;
    message: string;
    data: {
        items: T[];
        totalCount: number;
        nextCursor: string | null;
        hasMore: boolean;
    };
    timestamp: string;
}

async function request<T>(
    endpoint: string,
    options: RequestInit & RequestOptions = {}
): Promise<T> {
    const { headers, ...rest } = options;
    const apiUrl = getApiUrl();

    const res = await fetch(`${apiUrl}${endpoint}`, {
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

/**
 * Build a query-string from a plain object, omitting undefined/null values.
 */
function toQueryString(params: Record<string, unknown>): string {
    const filtered = Object.entries(params).filter(
        ([, v]) => v !== undefined && v !== null
    );
    if (filtered.length === 0) return "";
    return "?" + new URLSearchParams(filtered.map(([k, v]) => [k, String(v)])).toString();
}

export const api = {
    post: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
        request<T>(endpoint, { method: "POST", body: JSON.stringify(body), ...options }),

    get: <T>(endpoint: string, options?: RequestOptions) =>
        request<T>(endpoint, { method: "GET", ...options }),

    /**
     * Fetch a single page from a cursor-paginated endpoint.
     *
     * @example
     *   const page = await api.getPaginated<User>("/api/v1/users", { take: 50 });
     *   // next page:
     *   const page2 = await api.getPaginated<User>("/api/v1/users", {
     *       take: 50, cursor: page.data.nextCursor!,
     *   });
     */
    getPaginated: <T>(
        endpoint: string,
        params: { take?: number; cursor?: string } = {},
        options?: RequestOptions
    ) =>
        request<PaginatedResponse<T>>(
            `${endpoint}${toQueryString(params)}`,
            { method: "GET", ...options }
        ),

    /**
     * Stream **all** pages from a cursor-paginated endpoint via an async generator.
     * Ideal for bulk exports or background sync of 500k+ records.
     *
     * @example
     *   for await (const page of api.getAllPages<User>("/api/v1/users", { take: 100 })) {
     *       appendToTable(page.items);
     *   }
     */
    getAllPages: async function* <T>(
        endpoint: string,
        params: { take?: number } = {},
        options?: RequestOptions
    ): AsyncGenerator<{ items: T[]; totalCount: number; hasMore: boolean }> {
        let cursor: string | undefined;
        let hasMore = true;

        while (hasMore) {
            const res = await request<PaginatedResponse<T>>(
                `${endpoint}${toQueryString({ ...params, cursor })}`,
                { method: "GET", ...options }
            );

            yield {
                items: res.data.items,
                totalCount: res.data.totalCount,
                hasMore: res.data.hasMore,
            };

            hasMore = res.data.hasMore;
            cursor = res.data.nextCursor ?? undefined;
        }
    },
};
