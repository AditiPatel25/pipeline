import { prisma } from '../prisma.js';
import { type Request, type Response, type NextFunction } from 'express';
import client from '../config/supabase.js';

async function addResume(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Resume file is required',
            });
        }

        if (!req.authPayload) {
            return res.status(401).json({
                status: 401,
                error: 'Unauthorized',
                message: 'User is not logged in',
            });
        }

        const userId = req.authPayload.userId;

        const filePath = `${userId}/${req.file.originalname}`;

        const { error } = await client.storage
            .from('resumes')
            .upload(filePath, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: true,
            });

        if (error) {
            throw error;
        }

        const resume = await prisma.resume.upsert({
            where: {
                userId,
            },
            update: {
                fileName: req.file.originalname,
                filePath,
            },
            create: {
                userId,
                fileName: req.file.originalname,
                filePath,
            },
        });

        return res.status(201).json({
            success: true,
            message: 'Resume added',
            resume,
        });
    } catch (e) {
        next(e);
    }
}

async function deleteResume(
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

        const resume = await prisma.resume.findUnique({
            where: {
                userId: req.authPayload.userId,
            },
        });

        if (!resume) {
            return res.status(404).json({
                status: 404,
                error: 'Not Found',
                message: 'Resume not found',
            });
        }

         const { error } = await client.storage
            .from('resumes')
            .remove([resume.filePath]);

        if (error) {
            throw error;
        }

        await prisma.resume.delete({
            where: { userId: req.authPayload.userId },
        });
        return res.status(200).json({
            success: true,
            message: 'Resume deleted',
        });
    } catch (e) {
        next(e);
    }
}

async function getResume(
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

        const resume = await prisma.resume.findUnique({
            where: {
                userId: req.authPayload.userId,
            },
        });

        return res.status(200).json({
            success: true,
            message: 'Resume deleted',
            resume,
        });
    } catch (e) {
        next(e);
    }
}

export { addResume, deleteResume, getResume };
