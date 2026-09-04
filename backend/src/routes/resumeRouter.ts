import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { addResume, deleteResume, getResume } from '../controllers/resumeController.js';
import { resumeUpload } from '../middleware/upload.js';
const resumeRouter = Router();
resumeRouter.use(authenticateToken);

// add/update resume
resumeRouter.post('/', resumeUpload, addResume );

// delete resume
resumeRouter.delete('/', deleteResume);

// get resume
resumeRouter.get('/', getResume);

export default resumeRouter;
