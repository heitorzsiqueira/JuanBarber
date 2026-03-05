import { prisma } from '../config/Prisma.js';

export class GetUserRole {

    async execute(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                role: true,
            }
        })
        return user;
    }
}