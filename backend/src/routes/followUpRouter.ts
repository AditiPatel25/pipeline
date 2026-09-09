import { Router } from 'express';
import { createFollowUp, deleteFollowUp, editFollowUp, getAllFollowUps, getUpcomingFollowUps } from '../controllers/followUpController.js';
import { authenticateToken } from '../middleware/auth.js';
const followUpRouter = Router();
followUpRouter.use(authenticateToken);

followUpRouter.post('/', createFollowUp);

followUpRouter.get('/', getAllFollowUps);

// get upcoming followUps
followUpRouter.get('/upcoming', getUpcomingFollowUps);

// edit specific follow up
followUpRouter.patch('/:id', editFollowUp );

// delete follow up
followUpRouter.delete('/:id', deleteFollowUp );

export default followUpRouter;
