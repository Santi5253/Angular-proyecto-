import { Request, Response } from 'express';
import { ProductoModel } from '../../../models/producto.model';

export const getProductos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const productos = await ProductoModel.obtenerTodos();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

export const getProductoPorCodigo = async (req: Request, res: Response): Promise<void> => {
  try {
    const codigo = String(req.params.codigo);
    const producto = await ProductoModel.obtenerPorCodigo(codigo);

    if (!producto) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

export const postProducto = async (req: Request, res: Response): Promise<void> => {
  try {
    const creado = await ProductoModel.crear(req.body);

    if (!creado) {
      res.status(400).json({ error: 'Producto inválido o ya existe con ese código' });
      return;
    }

    res.status(201).json(creado);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

export const putProducto = async (req: Request, res: Response): Promise<void> => {
  try {
    const codigo = String(req.params.codigo);
    const actualizado = await ProductoModel.actualizar(codigo, req.body);

    if (!actualizado) {
      res.status(404).json({ error: 'Producto no encontrado o datos inválidos' });
      return;
    }

    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

export const deleteProducto = async (req: Request, res: Response): Promise<void> => {
  try {
    const codigo = String(req.params.codigo);
    const eliminado = await ProductoModel.eliminar(codigo);

    if (!eliminado) {
      res.status(404).json({ error: 'No existe ese código' });
      return;
    }

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};
