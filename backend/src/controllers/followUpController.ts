import { prisma } from '../prisma.js';
import { type Request, type Response, type NextFunction } from 'express';

type FollowUpParams = {
    id: string;
};

type ApplicationParams = {
    id: string;
};

async function getFollowUps(
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

        const allFollowUps = await prisma.followUp.findMany({
            where: {
                applicationId: id,
                application: {
                    userId: req.authPayload.userId,
                },
            },
        });

        return res.status(200).json({
            success: true,
            message: 'FollowUps loaded',
            allFollowUps,
        });
    } catch (e) {
        next(e);
    }
}

async function createFollowUp(
    req: Request<ApplicationParams>,
    res: Response,
    next: NextFunction
) {
    try {
        const { dueDate, notes, completed } = req.body;

        if (
            !dueDate ||
            dueDate.trim() === '' ||
            typeof completed !== 'boolean'
        ) {
            return res.status(400).json({
                success: false,
                message: 'Bad Request',
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
            },
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
                message: 'You can only add follow-ups to your own applications',
            });
        }

        const followUp = await prisma.followUp.create({
            data: {
                dueDate,
                notes,
                completed,
                application: {
                    connect: {
                        id: id,
                    },
                },
            },
        });

        return res.status(201).json({
            success: true,
            message: 'Follow up created',
            followUp,
        });
    } catch (e) {
        next(e);
    }
}

async function deleteFollowUp(
    req: Request<FollowUpParams>,
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
                message: 'Invalid follow up ID',
            });
        }

        const followUp = await prisma.followUp.findUnique({
            where: {
                id,
            },
            include: {
                application: true,
            },
        });

        if (!followUp) {
            return res.status(404).json({
                status: 404,
                error: 'Not Found',
                message: 'Follow up not found',
            });
        }

        if (req.authPayload.userId !== followUp.application.userId) {
            return res.status(403).json({
                status: 403,
                error: 'Forbidden',
                message: 'You can only delete your own follow up',
            });
        }

        await prisma.followUp.delete({
            where: { id: id },
        });
        return res.status(200).json({
            success: true,
            message: 'Follow up deleted',
        });
    } catch (e) {
        next(e);
    }
}

async function editFollowUp(
    req: Request<FollowUpParams>,
    res: Response,
    next: NextFunction
) {
    try {
        const { dueDate, completed, notes } = req.body;

        if (
            !dueDate ||
            dueDate.trim() === '' ||
            typeof completed !== 'boolean'
        ) {
            return res.status(400).json({
                success: false,
                message: 'Bad Request',
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
                message: 'Invalid follow up ID',
            });
        }

        const followUp = await prisma.followUp.findUnique({
            where: {
                id,
            },
            include: {
                application: true,
            },
        });

        if (!followUp) {
            return res.status(404).json({
                status: 404,
                error: 'Not Found',
                message: 'Follow up not found',
            });
        }

        if (followUp.application.userId !== req.authPayload.userId) {
            return res.status(403).json({
                status: 403,
                error: 'Forbidden',
                message: 'You can only edit your own follow up',
            });
        }

        const updatedFollowUp = await prisma.followUp.update({
            where: { id: id },
            data: {
                dueDate,
                completed,
                notes,
            },
        });

        return res.status(200).json({
            success: true,
            message: 'Follow up updated',
            updatedFollowUp,
        });
    } catch (e) {
        next(e);
    }
}

export { getFollowUps, createFollowUp, deleteFollowUp, editFollowUp };
