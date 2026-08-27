import { Router } from 'express';
import { editFollowUp, deleteFollowUp, getAllFollowUps } from '../controllers/followUpController.js';
import { createFollowUp } from '../controllers/followUpController.js';
import { authenticateToken } from '../middleware/auth.js';
const followUpRouter = Router();
followUpRouter.use(authenticateToken);

followUpRouter.post('/', createFollowUp);

followUpRouter.get('/', getAllFollowUps);

// edit specific follow up
followUpRouter.patch('/:id', editFollowUp );

// delete follow up
followUpRouter.delete('/:id', deleteFollowUp );

export default followUpRouter;
