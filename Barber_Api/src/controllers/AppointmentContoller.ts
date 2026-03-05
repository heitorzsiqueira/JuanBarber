import type { Request, Response } from 'express';
import CreateAppointmentService from '../services/CreateAppointmentService.js';
import { ListAppointmentsService } from '../services/ListAppointmentsService.js';



export class AppointmentController {
  async create(request: Request, response: Response) {

    const {  barber_id, service_id, date } = request.body;
    const user_id = (request as any).user.id;
    const createAppointmentService = new CreateAppointmentService();
    

    try {
      const appointment = await createAppointmentService.execute({
        date: date,
        user_id: user_id,
        barber_id: barber_id,
        service_id: service_id
      });
      return response.json(appointment);
    } catch (error) {
      return response.status(400).json({ error: "Erro ao criar agendamento." });
    }
  }

  async listbarberappointments(request: Request, response: Response) {
    const user_id = (request as any).user.id;
    const listAppointmentsService = new ListAppointmentsService();
    try {
      const appointments = await listAppointmentsService.listbarberappointments(user_id);
      return response.json(appointments);
    } catch (error) {
      return response.status(400).json({ error: "Erro ao listar agendamentos." });
    }
  }

  async listclientappointmens(request: Request, response: Response) {
    const user_id = (request as any).user.id;
    const listAppointmentsService = new ListAppointmentsService();
    try {
      const appointments = await listAppointmentsService.listclientappointmens(user_id);
      return response.json(appointments);
    } catch (error) {
      return response.status(400).json({ error: "Erro ao listar agendamentos." });
    }
  }

}