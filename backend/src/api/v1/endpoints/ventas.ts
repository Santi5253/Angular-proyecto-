import { Request, Response } from 'express';
import { VentaModel } from '../../../models/venta.model';

export const getVentas = async (_req: Request, res: Response): Promise<void> => {
  try {
    const ventas = await VentaModel.obtenerTodas();
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
};

export const postVenta = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cliente, documento, medio_pago, subtotal, descuento, total, items } = req.body ?? {};
    if (!medio_pago || subtotal == null || total == null || !Array.isArray(items)) {
      res.status(400).json({ error: 'Datos de venta inválidos' });
      return;
    }
    const venta = await VentaModel.crear(
      { cliente: cliente ?? '', documento: documento ?? '', medio_pago, subtotal: Number(subtotal), descuento: Number(descuento ?? 0), total: Number(total) },
      items
    );
    res.status(201).json(venta);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar la venta' });
  }
};

export const getResumenSemanal = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await VentaModel.resumenSemanal();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener resumen semanal' });
  }
};

export const getResumenMensual = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await VentaModel.resumenMensual();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener resumen mensual' });
  }
};
