import { Router } from 'express';
import { createResumeMatch } from '../controllers/aiController.js';
import { createApplication, deleteApplication, editApplication, getApplications, getApplicationStats, getRecentApplications } from '../controllers/applicationController.js';
import { authenticateToken } from '../middleware/auth.js';
const applicationRouter = Router();
applicationRouter.use(authenticateToken);

// create application
applicationRouter.post('/', createApplication);

// get all applications
applicationRouter.get('/', getApplications);

// get stats for all applications
applicationRouter.get('/stats', getApplicationStats);

// get recent applications
applicationRouter.get('/recent', getRecentApplications);

// match resume with job description
applicationRouter.post('/:id/resume-match', createResumeMatch );

// edit specific application
applicationRouter.patch('/:id', editApplication);

// delete application
applicationRouter.delete('/:id', deleteApplication);

export default applicationRouter;
