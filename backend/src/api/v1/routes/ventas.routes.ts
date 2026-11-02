import { Router } from 'express';
import { getVentas, postVenta, getResumenSemanal, getResumenMensual } from '../endpoints/ventas';

const router = Router();
router.get('/', getVentas);
router.post('/', postVenta);
router.get('/resumen/semanal', getResumenSemanal);
router.get('/resumen/mensual', getResumenMensual);
export default router;
