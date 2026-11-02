import { Request, Response } from 'express';
import { UsuarioModel } from '../../../models/usuario.model';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body ?? {};
    if (!username || !password) {
      res.status(400).json({ error: 'Usuario y contraseña requeridos' });
      return;
    }
    const user = await UsuarioModel.obtenerPorUsername(String(username));
    if (!user) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }
    const ok = await UsuarioModel.verificarPassword(String(password), user.password_hash);
    if (!ok) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }
    const usuario = { id: user.id, username: user.username, nombre: user.nombre, rol: user.rol };
    const token = UsuarioModel.generarToken(usuario);
    res.json({ token, usuario });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
