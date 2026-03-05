import { Router } from 'express';
import { ListController } from '../controllers/ListController.js';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js';



const listRoutes = Router();
const listController = new ListController();



listRoutes.get('/barbers', listController.listBarbers);
listRoutes.get('/services', listController.listServices);
listRoutes.get('/available', listController.listAvailableTimes);
listRoutes.get('/services', listController.listServices);

export { listRoutes };