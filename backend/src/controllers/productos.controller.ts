import { Request, Response } from 'express';
import { Producto, esProductoValido } from '../models/producto';

// Inventario en memoria (Fase 2: alistamiento). Cuando haya DB, aquí va pool.query.
let productos: Producto[] = [
  { codigo: 'CIG-001', nombre: 'Pielroja x20', categoria: 'Cigarrillos', precio: 9500, stock: 30 },
  { codigo: 'BEB-001', nombre: 'Pony Malta 330ml', categoria: 'Bebidas', precio: 3500, stock: 48 },
  { codigo: 'DUL-001', nombre: 'Chocorramo', categoria: 'Dulces', precio: 3500, stock: 25 },
];

// GET /getproductos — los clientes/productos se obtienen (get)
export function getProductos(_req: Request, res: Response): void {
  res.json(productos);
}

// POST /postproductos — tratar los datos (post)
export function postProducto(req: Request, res: Response): void {
  if (!esProductoValido(req.body)) {
    res.status(400).json({ error: 'Producto inválido: revise codigo, nombre, precio y stock' });
    return;
  }
  const existe = productos.some((p) => p.codigo.toLowerCase() === req.body.codigo.toLowerCase());
  if (existe) {
    res.status(409).json({ error: 'Ya existe ese código' });
    return;
  }
  productos.push(req.body);
  res.status(201).json(req.body);
}

// DELETE /deleteproductos/:codigo — se eliminan (delete)
export function deleteProducto(req: Request, res: Response): void {
  const antes = productos.length;
  productos = productos.filter((p) => p.codigo.toLowerCase() !== String(req.params.codigo).toLowerCase());
  if (productos.length === antes) {
    res.status(404).json({ error: 'No existe ese código' });
    return;
  }
  res.json({ ok: true });
}
