import express from 'express';
import cors from 'cors';
import productosRoutes from './routes/productos.routes';

// AppConfig: verifica permisos (CORS), json y rutas antes de iniciar
const app = express();

app.use(cors({ origin: process.env.FRONT_URL || 'http://localhost:4200' }));
app.use(express.json());

app.get('/salud', (_req, res) => {
  res.json({ ok: true, servicio: 'backend-caja-cigarreria' });
});

app.use('/', productosRoutes);

export default app;
