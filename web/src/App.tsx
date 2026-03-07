import { AuthSessionSync } from '@/features/auth/components/AuthSessionSync';
import { AppRoutes } from '@/routes/AppRoutes';

function App() {
  return (
    <>
      <AuthSessionSync />
      <AppRoutes />
    </>
  );
}

export default App;
