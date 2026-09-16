import api from './axiosInstance';

// upload a resume
export async function uploadResumeRequest(file: File) {
    const formData = new FormData();

    formData.append('resume', file);

    const res = await api.post('/resume', formData);

    return res.data;
}

// get resume
export async function getResumeRequest() {
    const res = await api.get('/resume');

    return res.data;
}

// delete resume
export async function deleteResumeRequest() {
    const res = await api.delete('/resume');

    return res.data;
}