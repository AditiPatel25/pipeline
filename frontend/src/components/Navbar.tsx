import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="border-b border-border bg-background">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                {/* logo */}
                <Link
                    to="/"
                    className="font-heading text-xl font-bold tracking-tight"
                >
                    pipeline
                </Link>

                {user && (
                    <div className="flex items-center gap-4">
                        {/* user */}
                        <Link
                            to="/profile"
                            className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                        >
                            <span>Hi, {user.name}</span>
                        </Link>

                        {/* logout */}
                        <button
                            type="button"
                            onClick={logout}
                            className="text-sm text-muted-foreground transition hover:text-foreground"
                        >
                            Log out
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
