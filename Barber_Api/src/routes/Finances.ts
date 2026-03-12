import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js';
import { FinancesController } from '../controllers/FinanceController.js';

const finacesController = new FinancesController();

const FinancesRoutes = Router();

FinancesRoutes.get('/stats', ensureAuthenticated, finacesController.getBalance);

export default FinancesRoutes;