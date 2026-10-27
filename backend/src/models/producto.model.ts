import { pool } from '../config/db';
import { Producto, esProductoValido } from './producto';

export class ProductoModel {
  static async obtenerTodos(): Promise<Producto[]> {
    const { rows } = await pool.query(
      'SELECT codigo, nombre, categoria, precio, stock FROM productos ORDER BY codigo'
    );
    return rows.map((r) => ({
      codigo: r.codigo,
      nombre: r.nombre,
      categoria: r.categoria,
      precio: Number(r.precio),
      stock: Number(r.stock),
    }));
  }

  static async obtenerPorCodigo(codigo: string): Promise<Producto | null> {
    const { rows } = await pool.query(
      'SELECT codigo, nombre, categoria, precio, stock FROM productos WHERE LOWER(codigo) = LOWER($1)',
      [codigo]
    );
    if (!rows[0]) return null;
    const r = rows[0];
    return {
      codigo: r.codigo,
      nombre: r.nombre,
      categoria: r.categoria,
      precio: Number(r.precio),
      stock: Number(r.stock),
    };
  }

  static async crear(producto: Producto): Promise<Producto | null> {
    if (!esProductoValido(producto)) {
      return null;
    }

    const existe = await this.obtenerPorCodigo(producto.codigo);
    if (existe) {
      return null;
    }

    await pool.query(
      'INSERT INTO productos (codigo, nombre, categoria, precio, stock) VALUES ($1, $2, $3, $4, $5)',
      [producto.codigo, producto.nombre, producto.categoria, producto.precio, producto.stock]
    );
    return { ...producto };
  }

  static async eliminar(codigo: string): Promise<boolean> {
    const res = await pool.query(
      'DELETE FROM productos WHERE LOWER(codigo) = LOWER($1)',
      [codigo]
    );
    return (res.rowCount ?? 0) > 0;
  }

  static async actualizar(codigo: string, cambios: Partial<Producto>): Promise<Producto | null> {
    const actual = await this.obtenerPorCodigo(codigo);
    if (!actual) return null;

    const actualizado: Producto = {
      ...actual,
      ...cambios,
      codigo: actual.codigo,
    };

    if (!esProductoValido(actualizado)) {
      return null;
    }

    await pool.query(
      'UPDATE productos SET nombre = $1, categoria = $2, precio = $3, stock = $4 WHERE LOWER(codigo) = LOWER($5)',
      [actualizado.nombre, actualizado.categoria, actualizado.precio, actualizado.stock, codigo]
    );
    return actualizado;
  }
}
