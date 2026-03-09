import type { Request, Response } from 'express';
import { prisma } from '../config/Prisma.js';
import { ListBarbersService } from '../services/ListBarbersService.js';
import { ListServicesService } from '../services/ListServicesService.js';
import { ListAvailableTimesService } from '../services/ListAvailableTimesService.js';

export class ListController {

  async listBarbers(req: Request, res: Response) {
    const listBarbersService = new ListBarbersService();
    const barbers = await listBarbersService.listBarbers();
    return res.json(barbers);
    
  }


  async listServices(req: Request, res: Response) {
    const listServicesService = new ListServicesService();
    const services = await listServicesService.listServices();
    return res.json(services);
  }

  async listAvailableTimes(req: Request, res: Response) {
    const { barber_id, date } = req.query as { barber_id: string; date: string };


    if (!barber_id || !date) {
      return res.status(400).json({ error: "Não recebi id nem data" });
    }

    const listAvailableTimesService = new ListAvailableTimesService();
    const availableTimes = await listAvailableTimesService.listAvailableTimes(barber_id, date);
    return res.json(availableTimes);
  }

}

