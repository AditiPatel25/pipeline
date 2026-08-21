export type Status =
    | 'APPLIED'
    | 'SCREENING'
    | 'INTERVIEW'
    | 'OFFER'
    | 'REJECTED'
    | 'WITHDRAWN'
    | 'GHOSTED';

export type WorkArrangement = 'ONSITE' | 'HYBRID' | 'REMOTE';

export type EmploymentType =
    | 'FULL_TIME'
    | 'PART_TIME'
    | 'CONTRACT'
    | 'INTERNSHIP'
    | 'TEMPORARY';

export type OutreachSource =
    | 'LINKEDIN'
    | 'REFERRAL'
    | 'COLD_EMAIL'
    | 'CAREER_FAIR'
    | 'OTHER';

export type ApplicationSource =
    | 'LINKEDIN'
    | 'REFERRAL'
    | 'COMPANY_WEBSITE'
    | 'COLD_EMAIL'
    | 'CAREER_FAIR'
    | 'OTHER';

export type ApplicationData = {
    company: string;
    position: string;
    jobUrl?: string;
    description?: string;
    status: Status;
    appliedDate?: string;
    source?: ApplicationSource | null;
    location?: string;
    workArrangement?: WorkArrangement | null;
    employmentType?: EmploymentType | null;
    notes?: string;
};

export type Application = ApplicationData & {
    id: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
};
