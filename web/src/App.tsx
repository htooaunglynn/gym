import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { AppRoutes } from '@/routes/AppRoutes';

function App() {
    const initialize = useAuthStore((s) => s.initialize);

    useEffect(() => {
        initialize();
    }, [initialize]);

    return <AppRoutes />;
}

export default App;
