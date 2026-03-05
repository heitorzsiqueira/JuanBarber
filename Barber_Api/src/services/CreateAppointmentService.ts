import { prisma } from '../config/Prisma.js';

export default class CreateAppointmentService {

  async execute({ date, user_id, barber_id, service_id }: { date: Date, user_id: string, barber_id: string, service_id: string }) {

    const appointment = await prisma.appointment.create({
      data: {
        date: date,
        client_id: user_id,
        barber_id: barber_id,
        service_id: service_id,

      }
    });
    return appointment;
  }

}