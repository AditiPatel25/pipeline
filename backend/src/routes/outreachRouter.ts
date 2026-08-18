import { Router } from 'express';
import { createOutreach, deleteOutreach, editOutreach, getAllOutreach } from '../controllers/outreachController.js';
import { authenticateToken } from '../middleware/auth.js';
const outreachRouter = Router();
outreachRouter.use(authenticateToken);

// create outreach
outreachRouter.post('/', createOutreach );

// get all outreach
outreachRouter.get('/', getAllOutreach );

// delete outreach
outreachRouter.delete('/:id', deleteOutreach );

// edit outeach
outreachRouter.patch('/:id', editOutreach );


export default outreachRouter;
