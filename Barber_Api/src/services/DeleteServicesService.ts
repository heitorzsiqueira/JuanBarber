import { prisma } from '../config/Prisma.js';

export  class DeleteServicesService {

    async execute(service_id: string) {
        await prisma.service.delete({
            where: {
                id: service_id
            }
        });
    }   
}   