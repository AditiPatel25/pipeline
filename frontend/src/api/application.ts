import api from './axiosInstance';
import type { ApplicationData } from '@/types/application';

export async function getApplicationsRequest() {
    const res = await api.get('/applications');
    return res.data;
}

export async function getApplicationByIdRequest(id: number) {
    const res = await api.get('/applications');
    return res.data;
}

export async function createApplicationRequest(data: ApplicationData) {
    const res = await api.post('/applications', data);
    return res.data;
}

export async function deleteApplicationRequest(id: number) {
    const res = await api.delete(`/applications/${id}`);
    return res.data;
}

export async function editApplicationRequest(
    id: number,
    data: ApplicationData
) {
    const res = await api.post(`/applications/${id}`, data);
    return res.data;
}
