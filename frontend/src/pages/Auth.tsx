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
    const [fieldErrors, setFieldErrors] = useState({
        identifier: false,
        username: false,
        password: false,
        email: false,
        name: false,
        confirmPassword: false,
    });

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        setFieldErrors((prev) => ({
            ...prev,
            [e.target.name]: false,
        }));
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    function handleAuthSwitch() {
        setFormData(emptyForm);
        setConfirmPassword('');
        setError('');
        setFieldErrors({
            identifier: false,
            username: false,
            password: false,
            email: false,
            name: false,
            confirmPassword: false,
        });
        navigate(isLogin ? '/auth/register' : '/auth/login');
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = {
            identifier: isLogin && !formData.identifier.trim(),
            username: !isLogin && !formData.username.trim(),
            password: !formData.password,
            email: !isLogin && !formData.email.trim(),
            name: !isLogin && !formData.name.trim(),
            confirmPassword: !isLogin && !confirmPassword,
        };

        setFieldErrors(errors);
        setError('');
        if (Object.values(errors).some(Boolean)) {
            return;
        }

        if (!isLogin) {
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email
            );

            if (!isValidEmail) {
                setFieldErrors((prev) => ({
                    ...prev,
                    email: true,
                }));
                setError('Please enter a valid email address');
                return;
            }

            if (formData.password !== confirmPassword) {
                setFieldErrors((prev) => ({
                    ...prev,
                    password: true,
                    confirmPassword: true
                }));
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
                    username: formData.username.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                    name: formData.name,
                });
                login(data.user);
            }

            setFormData(emptyForm);
            setConfirmPassword('');
            navigate('/');
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };
    const handleConfirmPasswordChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setError('');
        setFieldErrors((prev) => ({
            ...prev,
            confirmPassword: false,
        }));
        setConfirmPassword(e.target.value);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
            {isLogin ? (
                <Login
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    fieldErrors={fieldErrors}
                    error={error}
                />
            ) : (
                <Register
                    formData={formData}
                    confirmPassword={confirmPassword}
                    handleChange={handleChange}
                    handleConfirmPasswordChange={handleConfirmPasswordChange}
                    handleSubmit={handleSubmit}
                    fieldErrors={fieldErrors}
                    error={error}
                />
            )}

            <button
                type="button"
                onClick={handleAuthSwitch}
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
