import type { Request, Response } from 'express';
import { getFinanceStats } from '../services/GetFinanceStatusService.js';

export class FinancesController {
  async getBalance(request: Request, response: Response) {
    try {
    
      const barber_id = (request as any).user?.id; 

      if (!barber_id) {
        console.log("ID do barbeiro não encontrado no token." + barber_id);
        return response.status(400).json({ error: barber_id });
      }

      const getfinanceStats = await getFinanceStats(barber_id);

      console.log("Estatísticas calculadas:", getfinanceStats);

      return response.json(getfinanceStats);
    } catch (err) {
      console.error("Erro no Controller de Finanças:", err);
      return response.status(500).json({ error: 'Internal Server Error' });
    }
  }
}