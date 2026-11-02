import { Router } from 'express';
import { login } from '../endpoints/auth';

const router = Router();
router.post('/login', login);
export default router;
