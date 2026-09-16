import api from './axiosInstance';
import type { RegisterData } from '@/types/auth';

// login
export async function loginRequest(identifier: string, password: string) {
    const res = await api.post('/auth/login', {
        identifier,
        password,
    });

    return res.data;
}

// gets current user
export async function getCurrentUser() {
    const res = await api.get('/auth/me');
    return res.data;
}

// log out
export async function logoutRequest() {
    const res = await api.post('/auth/logout');
    return res.data;
}

// register a user
export async function registerRequest({
    username,
    email,
    password,
    name,
}: RegisterData) {
    const res = await api.post('/auth/register', {
        username,
        email,
        password,
        name,
    });
    return res.data;
}
