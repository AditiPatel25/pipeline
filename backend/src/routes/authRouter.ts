import { Router } from 'express';
import {
    register,
    login,
    getCurrentUser,
    logout,
    googleCallback
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import passport from 'passport';
import pkg from 'jsonwebtoken';
const { sign } = pkg;
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
