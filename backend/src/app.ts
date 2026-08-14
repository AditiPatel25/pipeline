import express from 'express';
import cors from 'cors';
import type { Request, Response, NextFunction } from "express";
import cookieParser from 'cookie-parser';

import authRouter from './routes/authRouter.js';
// import userRouter from './routes/userRouter.js';

const app = express();
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({ message: "Hello" });
});

app.use('/api/auth', authRouter);
// app.use('/api/users', userRouter);

// no route matched
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// global error handler (used when next(e))
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    const status = err.status || 500;
    const message = err.message || 'Internal server error';
    res.status(status).json({ error: message });
});

export default app;
