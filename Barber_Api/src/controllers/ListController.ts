import type { Request, Response } from 'express';
import { prisma } from '../config/Prisma.js';

export class ListController {

  async listBarbers(req: Request, res: Response) {
    const barbers = await prisma.user.findMany({
      where: { role: 'BARBER' },
      select: { id: true, name: true }
    });
    return res.json(barbers);
  }


  async listServices(req: Request, res: Response) {
    const services = await prisma.service.findMany();
    return res.json(services);
  }

  async listAvailableTimes(req: Request, res: Response) {
    const { barber_id, date } = req.query as { barber_id: string; date: string };


    if (!barber_id || !date) {
      return res.status(400).json({ error: "Não recebi id nem data" });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        barber_id: barber_id,
        date: {
          gte: new Date(`${date}T00:00:00.000Z`),
          lte: new Date(`${date}T23:59:59.999Z`),
        }
      },

      include: {
        service: true
      }
    });

    const JuanSchedule = [
      "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
      "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
      "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
    ];

    const available = JuanSchedule.filter(slot => {
      const isOccupied = appointments.some(app => {

        const startTimeLocal = new Date(app.date.getTime() - (3 * 60 * 60 * 1000));


        const durationInMs = app.service.duration_minutes * 60 * 1000;
        const endTimeLocal = new Date(startTimeLocal.getTime() + durationInMs);

        const timeParts = slot.split(':');
        const slotHour = parseInt(timeParts[0]!); 
        const slotMin = parseInt(timeParts[1]!);

        const slotDate = new Date(startTimeLocal);
        slotDate.setUTCHours(slotHour, slotMin, 0, 0);


        return slotDate >= startTimeLocal && slotDate < endTimeLocal;
      });

      return !isOccupied;
    });

    return res.json(available);
  }

  async listservices(req: Request, res: Response) {
    const services = await prisma.service.findMany();
    return res.json(services);
  }
}

