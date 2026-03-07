const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';

const BACKEND_API_KEY = import.meta.env.VITE_BACKEND_API_KEY;

type BackendError = {
  message?: string;
};

export async function syncCurrentUserWithBackend(token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/sync`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(BACKEND_API_KEY ? { 'x-api-key': BACKEND_API_KEY } : {}),
    },
  });

  if (response.ok) {
    return;
  }

  const body = (await response
    .json()
    .catch(() => null)) as BackendError | null;

  const message =
    body?.message ??
    `Backend auth sync failed with status ${response.status}`;

  throw new Error(message);
}
