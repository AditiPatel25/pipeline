import api from './axiosInstance';
import type { ApplicationData } from '@/types/application';

export async function getApplicationsRequest() {
    const res = await api.get('/applications');
    return res.data;
}

export async function getApplicationByIdRequest(id: number) {
    const res = await api.get(`/applications/${id}`);
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
    const res = await api.patch(`/applications/${id}`, data);
    return res.data;
}

export async function getApplicationStatsRequest() {
    const res = await api.get(`/applications/stats`);
    return res.data;
}

export async function getRecentApplicationsRequest() {
    const res = await api.get(`/applications/recent`);
    return res.data;
}

export async function createResumeMatchRequest(id: Number, resume: String) {
    const res = await api.post(`/applications/${id}/resume-match`, {resume});
    return res.data;
}

export async function getResumeMatchRequest(id: Number) {
    const res = await api.get(`/applications/${id}/resume-match`);
    return res.data;
}