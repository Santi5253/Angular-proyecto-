import { Router } from 'express';
import { deleteProducto, getProductos, getProductoPorCodigo, postProducto, putProducto } from '../controllers/productos.controller';

const router = Router();

// Menú de rutas del back (como en Angular, aquí se decide la descripción de la petición)
router.get('/getproductos', getProductos);
router.get('/getproductos/:codigo', getProductoPorCodigo);
router.post('/postproductos', postProducto);
router.put('/putproductos/:codigo', putProducto);
router.delete('/deleteproductos/:codigo', deleteProducto);

export default router;
