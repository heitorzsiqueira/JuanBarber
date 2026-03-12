import { prisma } from '../config/Prisma.js';

export class UpdateAppointmentStatus {
  async execute(appointment_id: string) {
    
    await prisma.appointment.update({
      where: {
        id: appointment_id
      },
      data: {
        status: 'SERVED'
      }
    });
  }
}
      