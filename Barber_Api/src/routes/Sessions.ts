import { Router } from 'express';
import { SessionsController } from '../controllers/SessionsController.js';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js';

const sessionRoutes = Router();
const sessionsController = new SessionsController();


sessionRoutes.post('/', ensureAuthenticated, sessionsController.create);
sessionRoutes.get('/me', ensureAuthenticated, sessionsController.getSession);

export { sessionRoutes };