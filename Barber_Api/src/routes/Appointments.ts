import { Router } from 'express';
import{AppointmentController} from '../controllers/AppointmentController.js';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js';


const appointmentController = new AppointmentController();


const AppointmentsRoutes = Router();


AppointmentsRoutes.post('/create', ensureAuthenticated, appointmentController.create); 
AppointmentsRoutes.get('/schedule', ensureAuthenticated, appointmentController.listbarberappointments);
AppointmentsRoutes.get('/client', ensureAuthenticated, appointmentController.listclientappointmens);
AppointmentsRoutes.delete('/:id', ensureAuthenticated, appointmentController.deleteAppointment);


export { AppointmentsRoutes };