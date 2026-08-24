import { prisma } from '../prisma.js';
import type { Request, Response, NextFunction } from 'express';
import {
    Status,
    WorkArrangement,
    EmploymentType,
    ApplicationSource,
} from '@prisma/client';

type ApplicationParams = {
    id: string;
};

async function getApplications(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        if (!req.authPayload) {
            return res.status(401).json({
                status: 401,
                error: 'Unauthorized',
                message: 'User is not logged in',
            });
        }

        const applications = await prisma.application.findMany({
            where: { userId: req.authPayload.userId },
        });

        return res.status(200).json({
            success: true,
            message: 'Applications loaded',
            applications,
        });
    } catch (e) {
        next(e);
    }
}

async function createApplication(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const {
            company,
            position,
            jobUrl,
            description,
            status,
            appliedDate,
            source,
            location,
            workArrangement,
            employmentType,
            notes,
        } = req.body;

        if (
            !company ||
            company.trim() === '' ||
            !position ||
            position.trim() === '' ||
            !status ||
            status.trim() === ''
        ) {
            return res.status(400).json({
                success: false,
                message: 'Bad Request',
            });
        }

        if (!Object.values(Status).includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${Object.values(Status).join(', ')}`,
            });
        }

        if (
            workArrangement !== null &&
            !Object.values(WorkArrangement).includes(workArrangement)
        ) {
            return res.status(400).json({
                success: false,
                message: `Invalid work arrangement. Must be one of: ${Object.values(WorkArrangement).join(', ')}`,
            });
        }

        if (
            employmentType !== null &&
            !Object.values(EmploymentType).includes(employmentType)
        ) {
            return res.status(400).json({
                success: false,
                message: `Invalid employment type. Must be one of: ${Object.values(EmploymentType).join(', ')}`,
            });
        }

        if (
            source !== null &&
            !Object.values(ApplicationSource).includes(source)
        ) {
            return res.status(400).json({
                success: false,
                message: `Invalid source. Must be one of: ${Object.values(ApplicationSource).join(', ')}`,
            });
        }

        if (!req.authPayload) {
            return res.status(401).json({
                status: 401,
                error: 'Unauthorized',
                message: 'User is not logged in',
            });
        }

        const application = await prisma.application.create({
            data: {
                company,
                position,
                jobUrl,
                description,
                status,
                appliedDate: appliedDate ? new Date(appliedDate) : null,
                source,
                location,
                notes,
                workArrangement,
                employmentType,
                userId: req.authPayload.userId,
            },
        });

        return res.status(201).json({
            success: true,
            message: 'Application created',
            application,
        });
    } catch (e) {
        next(e);
    }
}

async function deleteApplication(
    req: Request<ApplicationParams>,
    res: Response,
    next: NextFunction
) {
    try {
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
            },
        });

        if (!application) {
            return res.status(404).json({
                status: 404,
                error: 'Not Found',
                message: 'Application not found',
            });
        }

        if (req.authPayload.userId !== application.userId) {
            return res.status(403).json({
                status: 403,
                error: 'Forbidden',
                message: 'You can only delete your own application',
            });
        }

        await prisma.application.delete({
            where: { id: parseInt(req.params.id) },
        });
        return res.status(200).json({
            success: true,
            message: 'Application deleted',
        });
    } catch (e) {
        next(e);
    }
}

async function getApplicationById(
    req: Request<ApplicationParams>,
    res: Response,
    next: NextFunction
) {
    try {
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
            where: { id: id },
        });

        if (!application) {
            return res.status(404).json({
                status: 404,
                error: 'Not Found',
                message: 'Application not found',
            });
        }

        if (application.userId !== req.authPayload.userId) {
            return res.status(403).json({
                status: 403,
                error: 'Forbidden',
                message: 'You can only view your own applications',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Application found',
            application,
        });
    } catch (e) {
        next(e);
    }
}

async function editApplication(
    req: Request<ApplicationParams>,
    res: Response,
    next: NextFunction
) {
    try {
        const {
            company,
            position,
            jobUrl,
            description,
            status,
            appliedDate,
            source,
            location,
            workArrangement,
            employmentType,
            notes,
        } = req.body;

        if (
            !company ||
            company.trim() === '' ||
            !position ||
            position.trim() === '' ||
            !status ||
            status.trim() === ''
        ) {
            return res.status(400).json({
                success: false,
                message: 'Bad Request',
            });
        }

        if (!Object.values(Status).includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${Object.values(Status).join(', ')}`,
            });
        }

        if (
            workArrangement !== null &&
            !Object.values(WorkArrangement).includes(workArrangement)
        ) {
            return res.status(400).json({
                success: false,
                message: `Invalid work arrangement. Must be one of: ${Object.values(WorkArrangement).join(', ')}`,
            });
        }

        if (
            employmentType !== null &&
            !Object.values(EmploymentType).includes(employmentType)
        ) {
            return res.status(400).json({
                success: false,
                message: `Invalid employment type. Must be one of: ${Object.values(EmploymentType).join(', ')}`,
            });
        }

        if (
            source !== null &&
            !Object.values(ApplicationSource).includes(source)
        ) {
            return res.status(400).json({
                success: false,
                message: `Invalid source. Must be one of: ${Object.values(ApplicationSource).join(', ')}`,
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
            where: { id: id },
        });

        if (!application) {
            return res.status(404).json({
                status: 404,
                error: 'Not Found',
                message: 'Application not found',
            });
        }

        if (application.userId !== req.authPayload.userId) {
            return res.status(403).json({
                status: 403,
                error: 'Forbidden',
                message: 'You can only edit your own applications',
            });
        }

        const updatedApplication = await prisma.application.update({
            where: { id: parseInt(req.params.id) },
            data: {
                company,
                position,
                jobUrl,
                description,
                status,
                appliedDate: appliedDate ? new Date(appliedDate) : null,
                source,
                location,
                workArrangement,
                employmentType,
                notes,
            },
        });

        return res.status(200).json({
            success: true,
            message: 'Application updated',
            updatedApplication,
        });
    } catch (e) {
        next(e);
    }
}

async function getApplicationStats(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        if (!req.authPayload) {
            return res.status(401).json({
                status: 401,
                error: 'Unauthorized',
                message: 'User is not logged in',
            });
        }

        const total = await prisma.application.count({
            where: {
                userId: req.authPayload.userId,
            },
        });

        const applicationsByStatus = await prisma.application.groupBy({
            by: ['status'],
            _count: {
                status: true,
            },
        });

        const stats = applicationsByStatus.reduce(
            (acc, item) => {
                acc[item.status] = item._count.status;
                return acc;
            },
            {} as Record<string, number>
        );

        return res.status(200).json({
            success: true,
            message: 'Application stats loaded',
            total,
            stats,
        });
    } catch (e) {
        next(e);
    }
}

async function getRecentApplications(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        if (!req.authPayload) {
            return res.status(401).json({
                status: 401,
                error: 'Unauthorized',
                message: 'User is not logged in',
            });
        }

        const recentApplications = await prisma.application.findMany({
            where: { userId: req.authPayload.userId },
            take: 5,
            orderBy: {
                createdAt: 'desc',
            },
        });

        return res.status(200).json({
            success: true,
            message: 'Application stats loaded',
            recentApplications,
        });
    } catch (e) {
        next(e);
    }
}

export {
    getApplications,
    createApplication,
    getApplicationById,
    deleteApplication,
    editApplication,
    getApplicationStats,
    getRecentApplications,
};
