import { Router } from 'express';
import { deleteProducto, getProductos, postProducto } from '../controllers/productos.controller';

const router = Router();

// Menú de rutas del back (como en Angular, aquí se decide la descripción de la petición)
router.get('/getproductos', getProductos);
router.post('/postproductos', postProducto);
router.delete('/deleteproductos/:codigo', deleteProducto);

export default router;
