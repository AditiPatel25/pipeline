import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from './ui/spinner';

function ProtectedRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Spinner className="size-7 text-primary" />
            </div>
        ); 
    }

    return user ? <Outlet /> : <Navigate to="/auth/login" replace />;
}

export default ProtectedRoute;