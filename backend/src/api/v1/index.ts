import { Router } from 'express';
import productosRoutes from './routes/productos.routes';

// Router v1: agrega los endpoints bajo el prefijo /api/v1
const router = Router();

router.get('/salud', (_req, res) => {
  res.json({ ok: true, version: 'v1' });
});

router.use('/productos', productosRoutes);

export default router;
