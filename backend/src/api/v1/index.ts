import { Router } from 'express';
import productosRoutes from './routes/productos.routes';
import dashboardRoutes from './routes/dashboard.routes';
import ventasRoutes from './routes/ventas.routes';
import authRoutes from './routes/auth.routes';
import { verificarToken } from '../../middleware/auth';

// Router v1: agrega los endpoints bajo el prefijo /api/v1
const router = Router();

router.get('/salud', (_req, res) => {
  res.json({ ok: true, version: 'v1' });
});

// Ruta publica de autenticacion
router.use('/auth', authRoutes);

// Rutas protegidas (requieren token JWT)
router.use('/productos', verificarToken, productosRoutes);
router.use('/dashboard', verificarToken, dashboardRoutes);
router.use('/ventas', verificarToken, ventasRoutes);

export default router;
