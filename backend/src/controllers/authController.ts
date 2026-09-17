import { compare, hash } from 'bcryptjs';
import type { NextFunction, Request, Response } from 'express';
import pkg from 'jsonwebtoken';
import passport from 'passport';
import { prisma } from '../prisma.js';
const { sign } = pkg;

function issueAuthCookie(res: Response, userId: number) {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }

    const token = sign({ userId }, JWT_SECRET, { expiresIn: '30d' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
}

async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const username = req.body.username?.trim();
        const email = req.body.email?.toLowerCase().trim();
        const password = req.body.password;
        const name = req.body.name?.trim() || username;

        if (!username || !email || !password || !name) {
            return res.status(400).json({
                status: 400,
                error: 'Bad Request',
                message: 'Username, email, password, and name are required',
            });
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ username }, { email }],
            },
        });

        if (existingUser) {
            return res.status(409).json({
                status: 409,
                error: 'Conflict',
                message: 'User already exists',
            });
        }

        const hashedPassword = await hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                name,
            },
            select: {
                id: true,
                username: true,
                name: true,
            },
        });

        issueAuthCookie(res, newUser.id);

        return res.status(201).json({
            success: true,
            message: 'Registration was successful!',
            user: newUser,
        });
    } catch (e) {
        next(e);
    }
}

async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { password } = req.body;
        const identifier = req.body.identifier?.trim();

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: identifier },
                    { email: identifier?.toLowerCase() },
                ],
            },
        });

        if (!existingUser) {
            return res.status(401).json({
                status: 401,
                error: 'Unauthorized',
                message: 'Invalid username or password',
            });
        }

        if (!existingUser.password) {
            return res.status(401).json({
                status: 401,
                error: 'Unauthorized',
                message: 'Invalid username or password',
            });
        }

        const isMatch = await compare(password, existingUser.password);

        if (!isMatch) {
            return res.status(401).json({
                status: 401,
                error: 'Unauthorized',
                message: 'Invalid username or password',
            });
        }

        const { password: _, ...rest } = existingUser;

        issueAuthCookie(res, existingUser.id);
        return res.status(200).json({
            success: true,
            message: 'Authentication successful!',
            user: rest,
        });
    } catch (e) {
        next(e);
    }
}

async function getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.authPayload) {
            return res.status(401).json({
                error: 'Unauthorized',
            });
        }

        const currentUser = await prisma.user.findUnique({
            where: {
                id: req.authPayload.userId,
            },
            select: {
                id: true,
                username: true,
                email: true,
                name: true,
            },
        });

        if (!currentUser) {
            return res.status(404).json({
                status: 404,
                error: 'Not Found',
                message: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Found current user!',
            user: currentUser,
        });
    } catch (e) {
        next(e);
    }
}

async function logout(req: Request, res: Response) {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
    return res
        .status(200)
        .json({ success: true, message: 'Logged out successfully' });
}

async function googleCallback(req: Request, res: Response, next: NextFunction) {
    passport.authenticate(
        'google',
        { session: false },
        (err: any, user: Express.User | false, info: { message?: string }) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                const message = info?.message || 'google_auth_failed';
                return res.redirect(
                    `${process.env.CLIENT_URL}/login?error=${encodeURIComponent(message)}`
                );
            }

            issueAuthCookie(res, user.id);

            return res.redirect(`${process.env.CLIENT_URL}/`);
        }
    )(req, res, next);
}
export { getCurrentUser, googleCallback, login, logout, register };
