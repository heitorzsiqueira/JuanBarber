import { Supabase } from "../config/Supabase.js";
import type { Request, Response, NextFunction } from 'express';


export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string | undefined; 
    name: string;
    avatar_url: string | undefined;
  };
}

export async function ensureAuthenticated(
  req: Request, 
  res: Response, 
  next: NextFunction
) {
  
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    
    return res.status(401).json({ message: 'Token faltando' });
  }

  const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Token malformatado' });
    }

  const token = parts[1];


  try {
    const { data, error } = await Supabase.auth.getUser(token);
    

    if (error || !data.user) {

      return res.status(401).json({ message: 'Token é inválido' });
    }
    

    (req as AuthenticatedRequest).user = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.full_name ?? "Usuário",
      avatar_url: data.user.user_metadata?.avatar_url,
    };
     

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Falha na autenticação' });
  }
}