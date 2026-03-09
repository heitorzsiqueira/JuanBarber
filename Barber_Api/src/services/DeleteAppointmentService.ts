import { prisma } from '../config/Prisma.js';

export class DeleteAppointmentClientService {
  async execute(appointment_id: string) {
    
    await prisma.appointment.delete({
      where: {
        id: appointment_id
      }
    });
  }
}