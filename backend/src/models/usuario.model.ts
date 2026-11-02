import { pool } from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface Usuario {
  id: number;
  username: string;
  nombre: string;
  rol: string;
}

export class UsuarioModel {
  static async obtenerPorUsername(username: string): Promise<{ id: number; username: string; password_hash: string; nombre: string; rol: string } | null> {
    const { rows } = await pool.query(
      'SELECT id, username, password_hash, nombre, rol FROM usuarios WHERE username = $1',
      [username]
    );
    return rows[0] ?? null;
  }

  static async verificarPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generarToken(usuario: Usuario): string {
    const secret = process.env.JWT_SECRET || 'caja_cigarreria_secreto';
    return jwt.sign({ id: usuario.id, username: usuario.username, rol: usuario.rol }, secret, { expiresIn: '8h' });
  }
}
