import { prisma } from '../config/Prisma.js';

export class ListAppointmentsService {

  async listclientappointmens(userId: string) {
    const appointments = await prisma.appointment.findMany({
      where: { client_id: userId },
      include: {
        barber: {
          select: { name: true }
        },
        service: {
          select: { name: true, price: true }
        }
      },
      orderBy: { date: 'asc' }
    });
    return appointments;
  }

  async listbarberappointments(userId: string) {
    const appointments = await prisma.appointment.findMany({
      where: { barber_id: userId },
      include: {
        client: { select: { name: true } },
        service: { select: { name: true, duration_minutes: true } },
      },
      orderBy: { date: 'asc' }
    });



    return appointments;
  }
}