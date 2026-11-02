import { pool } from '../config/db';

export interface VentaItem {
  codigo: string;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Venta {
  id: number;
  fecha: Date;
  cliente: string;
  documento: string;
  medio_pago: string;
  subtotal: number;
  descuento: number;
  total: number;
  items?: VentaItem[];
}

export class VentaModel {
  static async crear(venta: Omit<Venta, 'id' | 'fecha' | 'items'>, items: VentaItem[]): Promise<Venta> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows } = await client.query(
        `INSERT INTO ventas (cliente, documento, medio_pago, subtotal, descuento, total)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, fecha`,
        [venta.cliente, venta.documento, venta.medio_pago, venta.subtotal, venta.descuento, venta.total]
      );
      const ventaId = rows[0].id;
      const fecha = rows[0].fecha;
      for (const it of items) {
        await client.query(
          `INSERT INTO venta_items (venta_id, codigo, cantidad, precio_unitario, subtotal)
           VALUES ($1,$2,$3,$4,$5)`,
          [ventaId, it.codigo, it.cantidad, it.precio_unitario, it.subtotal]
        );
      }
      await client.query('COMMIT');
      return { id: ventaId, fecha, ...venta, items };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  static async obtenerTodas(): Promise<Venta[]> {
    const { rows } = await pool.query(
      'SELECT id, fecha, cliente, documento, medio_pago, subtotal, descuento, total FROM ventas ORDER BY fecha DESC'
    );
    return rows.map((r) => ({
      id: r.id,
      fecha: r.fecha,
      cliente: r.cliente,
      documento: r.documento,
      medio_pago: r.medio_pago,
      subtotal: Number(r.subtotal),
      descuento: Number(r.descuento),
      total: Number(r.total),
    }));
  }

  static async resumenSemanal(): Promise<{ semana: string; total: number; cantidad: number }[]> {
    const { rows } = await pool.query(`
      SELECT semana, total::numeric AS total, cantidad_ventas::int AS cantidad
      FROM v_resumen_ventas_semanal
      ORDER BY semana_inicio;
    `);
    return rows.map((r) => ({ semana: r.semana, total: Number(r.total), cantidad: Number(r.cantidad) }));
  }

  static async resumenMensual(): Promise<{ mes: string; total: number; cantidad: number }[]> {
    const { rows } = await pool.query(`
      SELECT mes, total::numeric AS total, cantidad_ventas::int AS cantidad
      FROM v_resumen_ventas_mensual
      ORDER BY mes_inicio;
    `);
    return rows.map((r) => ({ mes: r.mes, total: Number(r.total), cantidad: Number(r.cantidad) }));
  }
}
