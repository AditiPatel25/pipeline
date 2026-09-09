export type ResumeSource =
    | 'SAVED'
    | 'ANOTHER'

export type ResumeMatch = {
    id: number;
    applicationId: number;
    matchScore: number;
    matchedSkills: string[];
    extractedGaps: string[];
    suggestions: string[];
    createdAt: string;
    resumeSource: ResumeSource
    resumeName: string;
};