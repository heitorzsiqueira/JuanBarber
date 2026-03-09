import { prisma } from '../config/Prisma.js';

export default class CreateServicesService {

  async execute({ name, description, price, duration_minutes }: { name: string, description: string, price: number, duration_minutes: number }) {

    const service = await prisma.service.create({
      data: {
        name: name,
        description: description,
        price: price,
        duration_minutes: duration_minutes
      }
    });
    return service;
  }

}   
       