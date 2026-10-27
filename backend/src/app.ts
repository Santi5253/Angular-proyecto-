import express from 'express';
import cors from 'cors';
import v1Router from './api/v1';

// AppConfig: verifica permisos (CORS), json y rutas antes de iniciar
const app = express();

app.use(cors({ origin: process.env.FRONT_URL || 'http://localhost:4200' }));
app.use(express.json());

app.get('/salud', (_req, res) => {
  res.json({ ok: true, servicio: 'backend-caja-cigarreria' });
});

// Todas las rutas de negocio quedan prefijadas por /api/v1 (estilo app/api/v1/endpoints)
app.use('/api/v1', v1Router);

export default app;
