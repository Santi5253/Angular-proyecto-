import dotenv from 'dotenv';
import app from './app';
import { verificarConexion } from './config/db';

dotenv.config();

// Serve: ya está todo listo y configurado, inicie (localhost para servicios)
const PORT = Number(process.env.PORT || 3000);

verificarConexion().finally(() => {
  app.listen(PORT, () => {
    console.log(`Back-end caja escuchando en http://localhost:${PORT}`);
    console.log('Rutas: GET /getproductos | POST /postproductos | DELETE /deleteproductos/:codigo | GET /salud');
  });
});
