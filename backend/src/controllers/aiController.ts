import type { Request, Response, NextFunction } from 'express';
import {
    analyzeResumeMatch,
    extractApplicationInfo,
} from '../services/aiService.js';
import { prisma } from '../prisma.js';

type ApplicationParams = {
    id: string;
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

async function createResumeMatch(
    req: Request<ApplicationParams>,
    res: Response,
    next: NextFunction
) {
    try {
        const { resume } = req.body;

        if (!resume || resume.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Resume is required',
            });
        }

        if (!req.authPayload) {
            return res.status(401).json({
                status: 401,
                error: 'Unauthorized',
                message: 'User is not logged in',
            });
        }

        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                status: 400,
                error: 'Bad Request',
                message: 'Invalid application ID',
            });
        }

        const application = await prisma.application.findUnique({
            where: {
                id: id,
                userId: req.authPayload.userId,
            },
        });

        if (!application) {
            return res.status(404).json({
                status: 404,
                error: 'Not Found',
                message: 'Application not found',
            });
        }

        if (!application.description) {
            return res.status(404).json({
                status: 404,
                error: 'Not Found',
                message: 'Application must have a description',
            });
        }

        const result = await analyzeResumeMatch(
            resume,
            application.description
        );

        const resumeMatch = await prisma.resumeMatch.create({
            data: {
                applicationId: id,
                matchScore: result.matchScore,
                matchedSkills: result.matchedSkills,
                extractedGaps: result.extractedGaps,
                suggestions: result.suggestions,
            },
        });

        return res.status(201).json({
            success: true,
            message: 'Resume match created',
            resumeMatch,
        });
    } catch (e) {
        next(e);
    }
}

export { extractApplication, createResumeMatch };
