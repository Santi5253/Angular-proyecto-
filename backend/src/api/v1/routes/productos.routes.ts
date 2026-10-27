import { Router } from 'express';
import { deleteProducto, getProductos, getProductoPorCodigo, postProducto, putProducto } from '../endpoints/productos';

const router = Router();

// Endpoints REST (prefijo /api/v1/productos)
router.get('/', getProductos);
router.get('/:codigo', getProductoPorCodigo);
router.post('/', postProducto);
router.put('/:codigo', putProducto);
router.delete('/:codigo', deleteProducto);

export default router;
