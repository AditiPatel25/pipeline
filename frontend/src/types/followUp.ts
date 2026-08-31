import { Application } from "./application";

export type FollowUpType =
    | 'ASSESSMENT'
    | 'PHONE_SCREEN'
    | 'INTERVIEW'
    | 'OFFER'
    | 'FOLLOW_UP_EMAIL'
    | 'OTHER';

export type FollowUpData = {
    applicationId: number;
    dueDate: string;
    notes?: string;
    title: string;
    type: FollowUpType;
    completed: boolean;  
};

export type FollowUp = FollowUpData & {
    id: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
    application: Application;
};

export type FollowUpFilter = 'ALL' | 'UPCOMING' | 'OVERDUE' | 'COMPLETED';
