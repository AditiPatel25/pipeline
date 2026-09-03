import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const extractApplicationInfo = async (jobDescription: string) => {
    const response = await openai.responses.create({
        model: 'gpt-5.6-luna',
        input: `
            Extract the following information from this job description:

            - Company
            - Position
            - Location
            - Work arrangement
            - Employment type

            Rules:
            - Only extract information explicitly stated or strongly implied by the job description.
            - If information cannot be determined, return null.
            - For work arrangement, use only REMOTE, HYBRID, or ONSITE.
            - For employment type, use only FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, or TEMPORARY.

            Job description:
            ${jobDescription}
        `,
        text: {
            format: {
                type: 'json_schema',
                name: 'application_extraction',
                strict: true,
                schema: {
                    type: 'object',
                    properties: {
                        company: {
                            type: ['string', 'null'],
                        },
                        position: {
                            type: ['string', 'null'],
                        },
                        location: {
                            type: ['string', 'null'],
                        },
                        workArrangement: {
                            type: ['string', 'null'],
                            enum: ['REMOTE', 'HYBRID', 'ONSITE', null],
                        },
                        employmentType: {
                            type: ['string', 'null'],
                            enum: [
                                'FULL_TIME',
                                'PART_TIME',
                                'CONTRACT',
                                'INTERNSHIP',
                                'TEMPORARY',
                                null,
                            ],
                        },
                    },
                    required: [
                        'company',
                        'position',
                        'location',
                        'workArrangement',
                        'employmentType',
                    ],
                    additionalProperties: false,
                },
            },
        },
    });

    return JSON.parse(response.output_text);
};

export const analyzeResumeMatch = async (
    resume: string,
    jobDescription: string
) => {
    const response = await openai.responses.create({
        model: 'gpt-5.6-luna',
        input: `
            Analyze how well the candidate's resume matches the job description.

            Your goal is to provide a concise, useful resume-to-job match assessment.

            Return:

            1. An overall match score from 0-100.
            2. The strongest skills or qualifications from the job description that are clearly supported by the resume.
            3. The most important skills or qualifications from the job description that are missing or not clearly demonstrated in the resume.
            4. The most useful ways the candidate could tailor their resume for this specific job.

            Rules:

            * Only use information explicitly present in the resume.
            * Do not assume the candidate has experience they did not mention.
            * Do not treat optional or preferred qualifications as required gaps.
            * Focus on qualifications that are actually relevant to the position.
            * Keep every item concise and scannable.
            * matchedSkills: return at most 6 items. Use short skill/technology names or brief qualifications, such as "React", "TypeScript", or "REST APIs".
            * extractedGaps: return at most 4 items. Use short skill or qualification names, not explanations or full sentences.
            * suggestions: return at most 3 actionable recommendations. Keep each to one concise sentence.
            * Do not repeat the same information across sections.
            * A high match score should reflect strong alignment with the important requirements, not simply the number of matching keywords.

            Resume:
            ${resume}

            Job Description:
            ${jobDescription}`,

        text: {
            format: {
                type: 'json_schema',
                name: 'resume_match',
                strict: true,
                schema: {
                    type: 'object',
                    properties: {
                        matchScore: {
                            type: 'integer',
                            minimum: 0,
                            maximum: 100,
                        },
                        matchedSkills: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                        },
                        extractedGaps: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                        },
                        suggestions: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                        },
                    },
                    required: [
                        'matchScore',
                        'matchedSkills',
                        'extractedGaps',
                        'suggestions',
                    ],
                    additionalProperties: false,
                },
            },
        },
    });

    return JSON.parse(response.output_text);
};
