import { Router } from 'express';
import passport from 'passport';
import {
    getCurrentUser,
    googleCallback,
    login,
    logout,
    register
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
const authRouter = Router();

// submit sign up form
authRouter.post('/register', register);

// log in
authRouter.post('/login', login);

// gets current user's info
authRouter.get('/me', authenticateToken, getCurrentUser);

// logout
authRouter.post('/logout', logout);

authRouter.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
    })
);

authRouter.get('/google/callback', googleCallback);

export default authRouter;
