import api from './axiosInstance';
import type { FollowUpData } from '@/types/followUp';

export async function getAllFollowUpsRequest() {
    const res = await api.get(`/followUps`);
    return res.data;
}

export async function createFollowUpRequest(data: FollowUpData) {
    const res = await api.post(`/followUps`, data);
    return res.data;
}

export async function getFollowUpsByApplicationRequest(applicationId: number) {
    const res = await api.get(`/applications/${applicationId}/followUps`);
    return res.data;
}

export async function createFollowUpByApplicationRequest(
    applicationId: number,
    data: FollowUpData
) {
    const res = await api.post(
        `/applications/${applicationId}/followUps`,
        data
    );
    return res.data;
}

export async function deleteFollowUpRequest(id: number) {
    const res = await api.delete(`/followUps/${id}`);
    return res.data;
}

export async function editFollowUpRequest(id: number, data: FollowUpData) {
    const res = await api.patch(`/followUps/${id}`, data);
    return res.data;
}
