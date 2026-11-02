import { Request, Response } from 'express';
import { pool } from '../../../config/db';
import { VentaModel } from '../../../models/venta.model';

export const getDashboardResumen = async (_req: Request, res: Response): Promise<void> => {
  try {
    const kpiSql = `
      SELECT
        COUNT(*)::int AS total_productos,
        COALESCE(SUM(stock), 0)::int AS total_stock,
        COALESCE(SUM(precio * stock), 0)::numeric AS valor_inventario
      FROM productos;
    `;
    const { rows: kpiRows } = await pool.query(kpiSql);
    const kpis = kpiRows[0];

    const catSql = `
      SELECT
        c.nombre AS categoria,
        COUNT(p.codigo)::int AS cantidad_productos,
        COALESCE(SUM(p.stock), 0)::int AS stock_total,
        COALESCE(SUM(p.precio * p.stock), 0)::numeric AS valor_total
      FROM productos p
      JOIN categorias c ON c.id = p.categoria_id
      GROUP BY c.nombre
      ORDER BY c.nombre;
    `;
    const { rows: categorias } = await pool.query(catSql);

    const critSql = `
      SELECT p.codigo, p.nombre, c.nombre AS categoria, p.stock, p.precio
      FROM productos p
      JOIN categorias c ON c.id = p.categoria_id
      WHERE p.stock <= 5
      ORDER BY p.stock ASC, p.codigo ASC;
    `;
    const { rows: criticos } = await pool.query(critSql);

    const ventasSemanales = await VentaModel.resumenSemanal();
    const ventasMensuales = await VentaModel.resumenMensual();

    res.json({
      kpis: {
        total_productos: Number(kpis.total_productos),
        total_stock: Number(kpis.total_stock),
        valor_inventario: Number(kpis.valor_inventario),
      },
      categorias: categorias.map((r) => ({
        categoria: r.categoria,
        cantidad_productos: Number(r.cantidad_productos),
        stock_total: Number(r.stock_total),
        valor_total: Number(r.valor_total),
      })),
      criticos: criticos.map((r) => ({
        codigo: r.codigo,
        nombre: r.nombre,
        categoria: r.categoria,
        stock: Number(r.stock),
        precio: Number(r.precio),
      })),
      ventas_semanales: ventasSemanales,
      ventas_mensuales: ventasMensuales,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos del dashboard' });
  }
};
