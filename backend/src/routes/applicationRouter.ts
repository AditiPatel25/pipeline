import { Router } from 'express';
import { createResumeMatch } from '../controllers/aiController.js';
import { createApplication, deleteApplication, editApplication, getApplicationById, getApplications, getApplicationStats, getRecentApplications, getResumeMatch } from '../controllers/applicationController.js';
import { createFollowUp, getFollowUpsByApplication } from '../controllers/followUpController.js';
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

// get resume with job description analysis
applicationRouter.get('/:id/resume-match', getResumeMatch);

// get specific application
applicationRouter.get('/:id', getApplicationById);

// edit specific application
applicationRouter.patch('/:id', editApplication);

// delete application
applicationRouter.delete('/:id', deleteApplication);

// create follow up
applicationRouter.post('/:id/followUps', createFollowUp);

// get all follow ups
applicationRouter.get('/:id/followUps', getFollowUpsByApplication);




export default applicationRouter;
