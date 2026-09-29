export type CategoriaTienda =
  | 'Cigarrillos'
  | 'Bebidas'
  | 'Dulces'
  | 'Abarrotes'
  | 'Licores'
  | 'Otros';

export interface Producto {
  codigo: string;
  nombre: string;
  categoria: CategoriaTienda;
  precio: number;
  stock: number;
}
