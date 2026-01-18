import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth'
import { Navigate, useLocation } from 'react-router';

const RequireAuth = ({ children }: { children: ReactNode }) => {
    const location = useLocation();
    const { isAuth } = useAuth();
    if (!isAuth) {
        return <Navigate to='/login' state={{ from: location }} />
    }
    return children;
}

export { RequireAuth };