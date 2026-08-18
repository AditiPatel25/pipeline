import { prisma } from '../prisma.js';
import { type Request, type Response, type NextFunction } from 'express';
import { OutreachSource } from '@prisma/client';
import type { Prisma } from '@prisma/client';

type OutreachParams = {
    id: string;
};

async function getAllOutreach(
    req: Request<OutreachParams>,
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

        const allOutreach = await prisma.outreach.findMany({
            where: {
                userId: req.authPayload.userId,
            },
        });

        return res.status(200).json({
            success: true,
            message: 'Outreach loaded',
            allOutreach,
        });
    } catch (e) {
        next(e);
    }
}

async function createOutreach(req: Request, res: Response, next: NextFunction) {
    try {
        const { company, contactName, sourceEnum, notes, date, applicationId } =
            req.body;

        if (
            !date ||
            !company ||
            typeof company !== 'string' ||
            company.trim() === ''
        ) {
            return res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'Date and company are required',
            });
        }

        const outreachDate = new Date(date);
        if (isNaN(outreachDate.getTime())) {
            return res.status(400).json({
                status: 400,
                error: 'Bad Request',
                message: 'Invalid date',
            });
        }

        if (!Object.values(OutreachSource).includes(sourceEnum)) {
            return res.status(400).json({
                success: false,
                message: `Invalid source. Must be one of: ${Object.values(OutreachSource).join(', ')}`,
            });
        }

        if (!req.authPayload) {
            return res.status(401).json({
                status: 401,
                error: 'Unauthorized',
                message: 'User is not logged in',
            });
        }

        let applicationIdNumber: number | undefined;

        if (applicationId !== undefined && applicationId !== null) {
            applicationIdNumber = parseInt(applicationId);

            if (Number.isNaN(applicationIdNumber)) {
                return res.status(400).json({
                    status: 400,
                    error: 'Bad Request',
                    message: 'Invalid application ID',
                });
            }

            const application = await prisma.application.findUnique({
                where: {
                    id: applicationIdNumber,
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
                    message:
                        'You can only add outreach to your own applications',
                });
            }
        }
        const outreach = await prisma.outreach.create({
            data: {
                date: outreachDate,
                notes,
                company,
                contactName,
                sourceEnum,

                user: {
                    connect: {
                        id: req.authPayload.userId,
                    },
                },

                ...(applicationIdNumber !== undefined && {
                    application: {
                        connect: {
                            id: applicationIdNumber,
                        },
                    },
                }),
            },
        });

        return res.status(201).json({
            success: true,
            message: 'Outreach created',
            outreach,
        });
    } catch (e) {
        next(e);
    }
}

async function deleteOutreach(
    req: Request<OutreachParams>,
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
                message: 'Invalid outreach ID',
            });
        }

        const outreach = await prisma.outreach.findUnique({
            where: {
                id,
            },
        });

        if (!outreach) {
            return res.status(404).json({
                status: 404,
                error: 'Not Found',
                message: 'Outreach not found',
            });
        }

        if (req.authPayload.userId !== outreach.userId) {
            return res.status(403).json({
                status: 403,
                error: 'Forbidden',
                message: 'You can only delete your own outreach',
            });
        }

        await prisma.outreach.delete({
            where: { id: id },
        });
        return res.status(200).json({
            success: true,
            message: 'Outreach deleted',
        });
    } catch (e) {
        next(e);
    }
}

async function editOutreach(
    req: Request<OutreachParams>,
    res: Response,
    next: NextFunction
) {
    try {
        const { company, contactName, sourceEnum, notes, date, applicationId } =
            req.body;

        if (
            !date ||
            !company ||
            typeof company !== 'string' ||
            company.trim() === ''
        ) {
            return res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'Date and company are required',
            });
        }

        const outreachDate = new Date(date);

        if (isNaN(outreachDate.getTime())) {
            return res.status(400).json({
                status: 400,
                error: 'Bad Request',
                message: 'Invalid date',
            });
        }

        if (!Object.values(OutreachSource).includes(sourceEnum)) {
            return res.status(400).json({
                success: false,
                message: `Invalid source. Must be one of: ${Object.values(OutreachSource).join(', ')}`,
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
                message: 'Invalid outreach ID',
            });
        }

        const outreach = await prisma.outreach.findUnique({
            where: { id },
        });

        if (!outreach) {
            return res.status(404).json({
                status: 404,
                error: 'Not Found',
                message: 'Outreach not found',
            });
        }

        if (outreach.userId !== req.authPayload.userId) {
            return res.status(403).json({
                status: 403,
                error: 'Forbidden',
                message: 'You can only edit your own outreach',
            });
        }

        const updateData: Prisma.OutreachUpdateInput = {
            date: outreachDate,
            notes,
            company,
            contactName,
            sourceEnum,
        };

        // if (applicationId === null) {
        //     updateData.application = { disconnect: true };
        // } else if (applicationId !== undefined) {
        //     const applicationIdNumber = parseInt(applicationId);

        //     if (isNaN(applicationIdNumber)) {
        //         return res.status(400).json({
        //             status: 400,
        //             error: 'Bad Request',
        //             message: 'Invalid application ID',
        //         });
        //     }

        //     const application = await prisma.application.findUnique({
        //         where: { id: applicationIdNumber },
        //     });

        //     if (!application) {
        //         return res.status(404).json({
        //             status: 404,
        //             error: 'Not Found',
        //             message: 'Application not found',
        //         });
        //     }

        //     if (application.userId !== req.authPayload.userId) {
        //         return res.status(403).json({
        //             status: 403,
        //             error: 'Forbidden',
        //             message:
        //                 'You can only associate outreach with your own applications',
        //         });
        //     }

        //     updateData.application = { connect: { id: applicationIdNumber } };
        // }

        const updatedOutreach = await prisma.outreach.update({
            where: { id },
            data: updateData,
        });

        return res.status(200).json({
            success: true,
            message: 'Outreach updated',
            updatedOutreach,
        });
    } catch (e) {
        next(e);
    }
}

export { getAllOutreach, createOutreach, deleteOutreach, editOutreach };
