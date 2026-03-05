import { prisma } from '../config/Prisma.js';

export class GetOrCreateUserService {
  async execute(userData: { id: string, email: string, name: string, avatar_url?: string }) {

    let user = await prisma.user.findUnique({
      where: { id: userData.id }
    });

    
    
    if (!user) {
      user = await prisma.user.create({
          data: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          password_hash: "",
          ...(userData.avatar_url && { avatar_url: userData.avatar_url })
        }
      });
    }

    return user;
  }
}