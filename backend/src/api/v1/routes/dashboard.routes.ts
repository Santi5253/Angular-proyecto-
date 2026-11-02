import { Router } from 'express';
import { getDashboardResumen } from '../endpoints/dashboard';

const router = Router();
router.get('/resumen', getDashboardResumen);
export default router;
