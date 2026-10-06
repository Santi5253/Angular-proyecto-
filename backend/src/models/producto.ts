export type Categoria = 'Cigarrillos' | 'Bebidas' | 'Dulces' | 'Abarrotes' | 'Licores' | 'Otros';

// Plantilla que verifica los datos (Model): qué es válido y qué no
export interface Producto {
  codigo: string;
  nombre: string;
  categoria: Categoria;
  precio: number;
  stock: number;
}

export function esProductoValido(p: unknown): p is Producto {
  if (typeof p !== 'object' || p === null) return false;
  const x = p as Record<string, unknown>;
  return (
    typeof x.codigo === 'string' &&
    (x.codigo as string).trim().length >= 3 &&
    typeof x.nombre === 'string' &&
    (x.nombre as string).trim().length >= 3 &&
    typeof x.precio === 'number' &&
    (x.precio as number) >= 0 &&
    typeof x.stock === 'number' &&
    (x.stock as number) >= 0
  );
}
