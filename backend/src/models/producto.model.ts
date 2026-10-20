// backend/src/models/producto.model.ts
import { productosDB } from '../config/producto.db';
import { Producto, esProductoValido } from './producto';

export class ProductoModel {
  static async obtenerTodos(): Promise<Producto[]> {
    // Devolvemos una copia para evitar mutaciones directas fuera de la clase
    return [...productosDB];
  }

  static async obtenerPorCodigo(codigo: string): Promise<Producto | null> {
    const prod = productosDB.find(
      (p) => p.codigo.toLowerCase() === codigo.toLowerCase()
    );
    return prod ? { ...prod } : null;
  }

  static async crear(producto: Producto): Promise<Producto | null> {
    // Validamos con la misma función que ya usas
    if (!esProductoValido(producto)) {
      return null;
    }

    const existe = productosDB.some(
      (p) => p.codigo.toLowerCase() === producto.codigo.toLowerCase()
    );
    if (existe) {
      return null; // El controlador decidirá el status 409
    }

    const nuevo: Producto = { ...producto };
    productosDB.push(nuevo);
    return { ...nuevo };
  }

  static async eliminar(codigo: string): Promise<boolean> {
    const index = productosDB.findIndex(
      (p) => p.codigo.toLowerCase() === codigo.toLowerCase()
    );
    if (index === -1) return false;
    productosDB.splice(index, 1);
    return true;
  }


  static async actualizar(codigo: string, cambios: Partial<Producto>): Promise<Producto | null> {
    const index = productosDB.findIndex(
      (p) => p.codigo.toLowerCase() === codigo.toLowerCase()
    );
    if (index === -1) return null;

    const actualizado: Producto = {
      ...productosDB[index],
      ...cambios,
      codigo: productosDB[index].codigo // No dejamos cambiar el código
    };

    if (!esProductoValido(actualizado)) {
      return null;
    }

    productosDB[index] = actualizado;
    return { ...actualizado };
  }
}
