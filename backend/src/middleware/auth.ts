import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  usuario?: { id: number; username: string; rol: string };
}

export function verificarToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).json({ error: 'Token no proporcionado' });
    return;
  }
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  try {
    const secret = process.env.JWT_SECRET || 'caja_cigarreria_secreto';
    const payload = jwt.verify(token, secret) as { id: number; username: string; rol: string };
    req.usuario = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}
