import api from './axiosInstance';

export async function loginRequest(identifier: string, password: string) {
    const res = await api.post('/auth/login', {
        identifier,
        password,
    });

    return res.data;
}

export async function getCurrentUser() {
    const res = await api.get('/auth/me');
    return res.data;
}

export async function logoutRequest() {
    const res = await api.post('/auth/logout');
    return res.data;
}

interface RegisterData {
    username: string;
    email: string;
    password: string;
    name: string;
}

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
