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
};

export type FollowUp = FollowUpData & {
    id: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
};
