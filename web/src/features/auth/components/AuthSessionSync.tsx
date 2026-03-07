import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/react';

import { syncCurrentUserWithBackend } from '@/features/auth/api/sync-current-user';

export function AuthSessionSync() {
  const attemptedSessionIdsRef = useRef<Set<string>>(new Set());
  const { isLoaded, isSignedIn, sessionId, getToken } = useAuth();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !sessionId) {
      return;
    }

    if (attemptedSessionIdsRef.current.has(sessionId)) {
      return;
    }

    attemptedSessionIdsRef.current.add(sessionId);

    const sync = async () => {
      const token = await getToken();
      if (!token) {
        return;
      }

      try {
        await syncCurrentUserWithBackend(token);
      } catch (error) {
        console.error('Failed to sync Clerk user with backend', error);
      }
    };

    void sync();
  }, [getToken, isLoaded, isSignedIn, sessionId]);

  return null;
}
