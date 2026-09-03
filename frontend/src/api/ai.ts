import { ApplicationExtraction } from '@/types/application';
import api from './axiosInstance';

export async function extractApplicationRequest(
    jobDescription: string
): Promise<ApplicationExtraction> {
    const res = await api.post('/ai/extract-application', {
        jobDescription,
    });

    return res.data.extractedInfo;
}
