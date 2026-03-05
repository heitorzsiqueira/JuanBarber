import type { Request, Response } from 'express';
import { GetOrCreateUserService } from '../services/GetOrCreateUserService.js';
import { GetUserRole } from '../services/GetUserRole.js';

export class SessionsController {
  async create(request: Request, response: Response) {
    try {

      const { id, email, name, avatar_url } = (request as any).user;
  

      const getOrCreateUser = new GetOrCreateUserService();

      const user = await getOrCreateUser.execute({
        id,
        email,
        name,
        avatar_url
      });


      return response.status(200).json("Sessão criada com sucesso. bem vindo, " + user.name);
    } catch (error) {
      return response.status(400).json({ error: "Erro ao processar sessão." });
    
    }
  }

  async getSession(request: Request, response: Response) {
    try {

      const { id } = (request as any).user;
      const getUserRole = new GetUserRole();
      const user = await getUserRole.execute(id);
      return response.status(200).json(user);
    } catch (error) {
      return response.status(400).json({ error: "Erro ao obter sessão." });
    }

  }
}