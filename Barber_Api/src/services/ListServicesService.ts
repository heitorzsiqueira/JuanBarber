import { prisma } from '../config/Prisma.js';

export class ListServicesService {

  async listServices() {
     const services = await prisma.service.findMany();
    return services;
    }
}