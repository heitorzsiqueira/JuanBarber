import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js';
import { ServicesController } from '../controllers/ServicesController.js';

const servicesController = new ServicesController();

export const servicesRouter = Router();

servicesRouter.post('/create', ensureAuthenticated, servicesController.create);
servicesRouter.delete('/:id', ensureAuthenticated, servicesController.delete);