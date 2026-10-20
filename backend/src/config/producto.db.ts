// backend/src/config/productos.db.ts
import { Producto } from '../models/producto';

export const productosDB: Producto[] = [
  { codigo: 'CIG-001', nombre: 'Pielroja x20', categoria: 'Cigarrillos', precio: 9500, stock: 30 },
  { codigo: 'BEB-001', nombre: 'Pony Malta 330ml', categoria: 'Bebidas', precio: 3500, stock: 48 },
  { codigo: 'DUL-001', nombre: 'Chocorramo', categoria: 'Dulces', precio: 3500, stock: 25 },
];

// Opcional: útil si algún día pasan a ID numérico. Con 'codigo' (string) no es estrictamente necesario.
// Lo dejo para imitar la idea del profe.
let siguienteId = productosDB.length + 1;
export const obtenerSiguienteId = (): number => {
  const id = siguienteId;
  siguienteId += 1;
  return id;
};