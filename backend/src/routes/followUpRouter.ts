import { Router } from 'express';
import {editFollowUp, deleteFollowUp } from '../controllers/followUpController.js';
import { authenticateToken } from '../middleware/auth.js';
const applicationRouter = Router();
applicationRouter.use(authenticateToken);

// edit specific follow up
applicationRouter.patch('/:id', editFollowUp );

// delete follow up
applicationRouter.delete('/:id', deleteFollowUp );

export default applicationRouter;
