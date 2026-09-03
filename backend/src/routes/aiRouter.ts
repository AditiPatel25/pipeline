import { Router } from 'express';
import {
    extractApplication
} from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/auth.js';
const aiRouter = Router();
aiRouter.use(authenticateToken);

// extract job posting info
aiRouter.post('/extract-application', extractApplication);


export default aiRouter;
