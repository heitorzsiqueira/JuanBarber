import type { Request, Response } from 'express';
import CreateServiceService from '../services/CreateServicesService.js';
import { DeleteServicesService } from '../services/DeleteServicesService.js';

export class ServicesController {
  async create(request: Request, response: Response) {
    const { name, description, price, duration_minutes } = request.body;
    const createServiceService = new CreateServiceService();

    try {
      const service = await createServiceService.execute({
        name: name,
        description: description,
        price: price,
        duration_minutes: duration_minutes
      });
      return response.json(service);
    } catch (error) {
      return response.status(400).json({ error: "Erro ao criar serviço." });
    }
  }

  async delete(request: Request, response: Response) {
    const deleteServicesService = new DeleteServicesService();
    const service_id = (request as any).params.id;
    
    try {
      await deleteServicesService.execute(service_id);
      return response.json({ message: "Serviço deletado com sucesso." });
    } catch (error) {
     if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        return response.status(400).json({
          error: "Este serviço já possui agendamentos registrados e não pode ser excluído para manter o histórico da barbearia."
        });

        return response.status(400).json({ error: "Erro ao deletar serviço cuzinho." + (error as Error).message });
      }
    }
  }
}
