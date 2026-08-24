import { Router } from 'express';
import { createApplication, deleteApplication, editApplication, getApplicationById, getApplications, getApplicationStats, getRecentApplications } from '../controllers/applicationController.js';
import { createFollowUp, getFollowUps } from '../controllers/followUpController.js';
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

// get specific application
applicationRouter.get('/:id', getApplicationById);

// edit specific application
applicationRouter.patch('/:id', editApplication);

// delete application
applicationRouter.delete('/:id', deleteApplication);

// create follow up
applicationRouter.post('/:id/followUps', createFollowUp);

// get all follow ups
applicationRouter.get('/:id/followUps', getFollowUps);




export default applicationRouter;
