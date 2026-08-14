import pkg from 'jsonwebtoken';
const { verify } = pkg;
import type { Request, Response, NextFunction } from 'express';
import type { AuthPayload } from '../types/auth.js';

function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            status: 401,
            error: 'Unauthorized',
            message: 'Unauthorized user',
        });
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }

    try {
        const decoded = verify(token, JWT_SECRET) as AuthPayload;
        req.authPayload = decoded

        next();
    } catch {
        return res.status(401).json({
            status: 401,
            error: 'Unauthorized',
            message: 'Unauthorized user',
        });
    }
}

export { authenticateToken };
