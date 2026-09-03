import type { Request, Response, NextFunction } from 'express';
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

async function extractApplication(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { jobDescription } = req.body;

        if (!jobDescription || jobDescription.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Job description is required',
            });
        }

        if (!req.authPayload) {
            return res.status(401).json({
                status: 401,
                error: 'Unauthorized',
                message: 'User is not logged in',
            });
        }

        const extractedInfo = await extractApplicationInfo(jobDescription);
       

        return res.status(200).json({
            success: true,
            message: 'Job application info extracted',
            extractedInfo,
        });
    } catch (e) {
        next(e);
    }
}

export { extractApplication };
