import { loginRequest, registerRequest } from '@/api/auth.js';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
    identifier: '',
    username: '',
    password: '',
    email: '',
    name: '',
};

function Auth() {
    const [formData, setFormData] = useState(emptyForm);
    const location = useLocation();
    const isLogin = location.pathname === '/auth/login';
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    function onClick() {
        setFormData(emptyForm);
        setConfirmPassword('');
        setError('');
        navigate(isLogin ? '/auth/register' : '/auth/login');
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        // setLoading(true);
        if (!isLogin) {
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email
            );

            if (!isValidEmail) {
                setError('Please enter a valid email address');
                return;
            }

            if (formData.password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
        }

        try {
            if (isLogin) {
                const data = await loginRequest(
                    formData.identifier,
                    formData.password
                );
                login(data.user);
            } else {
                const data = await registerRequest({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                });
                login(data.user);
            }

            setFormData(emptyForm);
            setConfirmPassword('');
            navigate('/');
        } catch (err) {
            getErrorMessage(err);
            setError(getErrorMessage(err))
        }
    };

    const handleConfirmPasswordChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setError('');
        setConfirmPassword(e.target.value);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
            {error && (
                <div className="mb-4 w-full max-w-md rounded-md border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-300">
                    {error}
                </div>
            )}

            {isLogin ? (
                <Login
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                />
            ) : (
                <Register
                    formData={formData}
                    confirmPassword={confirmPassword}
                    handleChange={handleChange}
                    handleConfirmPasswordChange={handleConfirmPasswordChange}
                    handleSubmit={handleSubmit}
                />
            )}

            <button
                type="button"
                onClick={onClick}
                className="mt-4 text-sm text-muted-foreground hover:text-foreground hover:underline"
            >
                {isLogin
                    ? "Don't have an account? Register"
                    : 'Already have an account? Login'}
            </button>
        </div>
    );
}

export default Auth;
