import {
    createContext,
    useEffect,
    useContext,
    useState,
    type ReactNode,
} from 'react';
import api from '../api/axiosInstance';

import { getCurrentUser } from '../api/auth';

interface User {
    id: number;
    username: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (user: User) => void;
    logout: () => void;
    updateUser: (updatedFields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCurrentUser() {
            try {
                const response = await getCurrentUser();
                setUser(response.user);
            } catch (e) {
                console.error('Error fetching current user:', e);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        fetchCurrentUser();
    }, []);

    function login(user: User) {
        setUser(user);
    }

    function logout() {
        setUser(null);
    }

    function updateUser(updatedFields: Partial<User>) {
        setUser((prev) =>
            prev ? { ...prev, ...updatedFields } : null
        );
    }

    return (
        <AuthContext.Provider
            value={{ user, loading, login, logout, updateUser }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;