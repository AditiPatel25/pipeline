import { Router } from 'express';
import { createApplication, deleteApplication, editApplication, getApplicationById, getApplications } from '../controllers/applicationController.js';
import { authenticateToken } from '../middleware/auth.js';
const applicationRouter = Router();

// create application
applicationRouter.post('/', authenticateToken, createApplication);

// get all applications
applicationRouter.get('/', authenticateToken, getApplications);

// get specific application
applicationRouter.get('/:id', authenticateToken, getApplicationById);

// edit specific application
applicationRouter.patch('/:id', authenticateToken, editApplication);

// delete application
applicationRouter.delete('/:id', authenticateToken, deleteApplication);

export default applicationRouter;
