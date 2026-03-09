import { prisma } from '../config/Prisma.js';

export class ListBarbersService {

  async listBarbers() {
    const barbers = await prisma.user.findMany({
      where: {
        role: {
          in: ['BARBER', 'JUAN'] 
        }
      }
    });
    return barbers;
  }


}
