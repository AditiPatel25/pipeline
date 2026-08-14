import type { AuthPayload } from './auth.js';
import type { User as PrismaUser } from '@prisma/client';

declare global {
    namespace Express {
        interface User extends PrismaUser {}

        interface Request { authPayload?: AuthPayload }
    }
}

export {};