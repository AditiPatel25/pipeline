import type { FollowUpData } from '@/types/followUp';
import api from './axiosInstance';

// get all follow ups 
export async function getAllFollowUpsRequest() {
    const res = await api.get(`/followUps`);
    return res.data;
}

// get upcoming follow ups (for dashboard)
export async function getUpcomingFollowUpsRequest() {
    const res = await api.get(`/followUps/upcoming`);
    return res.data;
}

// create a follow up
export async function createFollowUpRequest(data: FollowUpData) {
    const res = await api.post(`/followUps`, data);
    return res.data;
}

// delete a follow up
export async function deleteFollowUpRequest(id: number) {
    const res = await api.delete(`/followUps/${id}`);
    return res.data;
}

// edit a follow up
export async function editFollowUpRequest(id: number, data: FollowUpData) {
    const res = await api.patch(`/followUps/${id}`, data);
    return res.data;
}
