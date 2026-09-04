import api from './axiosInstance';

export async function uploadResumeRequest(file: File) {
    const formData = new FormData();

    formData.append('resume', file);

    const res = await api.post('/resume', formData);

    return res.data;
}

export async function getResumeRequest() {
    const res = await api.get('/resume');

    return res.data;
}

export async function deleteResumeRequest() {
    const res = await api.delete('/resume');

    return res.data;
}