import { Outlet } from 'react-router-dom';

function AuthLayout() {
    return (
        <div className="min-h-screen">
            <header className="flex h-14 items-center border-b px-4">
                <span className="text-xl font-bold text-primary">
                    pipeline
                </span>
            </header>

            <Outlet />
        </div>
    );
}

export default AuthLayout;