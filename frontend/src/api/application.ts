import type { ApplicationData } from '@/types/application';
import { ResumeSource } from '@/types/resumeMatch';
import api from './axiosInstance';

// gets all applications
export async function getApplicationsRequest() {
    const res = await api.get('/applications');
    return res.data;
}

// creates an application
export async function createApplicationRequest(data: ApplicationData) {
    const res = await api.post('/applications', data);
    return res.data;
}

// deletes an application
export async function deleteApplicationRequest(id: number) {
    const res = await api.delete(`/applications/${id}`);
    return res.data;
}

// edits an application
export async function editApplicationRequest(
    id: number,
    data: ApplicationData
) {
    const res = await api.patch(`/applications/${id}`, data);
    return res.data;
}

// gets application stats (for dashboard)
export async function getApplicationStatsRequest() {
    const res = await api.get(`/applications/stats`);
    return res.data;
}

// gets recent applications (for dashboard)
export async function getRecentApplicationsRequest() {
    const res = await api.get(`/applications/recent`);
    return res.data;
}

// creates resume analysis
export async function createResumeMatchRequest(
    id: number,
    resumeSource: ResumeSource,
    resume?: string
) {
    const res = await api.post(`/applications/${id}/resume-match`, {
        resumeSource,
        resume,
    });

    return res.data.resumeMatch;
}
