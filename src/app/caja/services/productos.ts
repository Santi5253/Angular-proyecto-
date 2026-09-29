import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../models/producto';

const STORAGE_KEY = 'caja_productos_cigarreria';

const SEMILLA: Producto[] = [
  { codigo: 'CIG-001', nombre: 'Pielroja x20', categoria: 'Cigarrillos', precio: 9500, stock: 30 },
  { codigo: 'CIG-002', nombre: 'Marlboro Rojo x20', categoria: 'Cigarrillos', precio: 14500, stock: 20 },
  { codigo: 'BEB-001', nombre: 'Pony Malta 330ml', categoria: 'Bebidas', precio: 3500, stock: 48 },
  { codigo: 'BEB-002', nombre: 'Coca-Cola 400ml', categoria: 'Bebidas', precio: 4000, stock: 36 },
  { codigo: 'DUL-001', nombre: 'Chocorramo', categoria: 'Dulces', precio: 3500, stock: 25 },
  { codigo: 'ABA-001', nombre: 'Papas Margarita 105g', categoria: 'Abarrotes', precio: 6500, stock: 18 },
];

@Injectable({
  providedIn: 'root',
})
export class Productos {
  private readonly _productos = new BehaviorSubject<Producto[]>(this.cargar());
  readonly productos$ = this._productos.asObservable();

  listar(): Producto[] {
    return [...this._productos.value];
  }

  crear(p: Producto): void {
    const actual = this.listar();
    if (actual.some((x) => x.codigo.toLowerCase() === p.codigo.toLowerCase())) {
      throw new Error(`Ya existe un producto con código ${p.codigo}`);
    }
    this.guardar([...actual, p]);
  }

  actualizar(codigo: string, cambios: Producto): void {
    const actual = this.listar().map((x) =>
      x.codigo.toLowerCase() === codigo.toLowerCase() ? { ...cambios } : x,
    );
    this.guardar(actual);
  }

  eliminar(codigo: string): void {
    this.guardar(this.listar().filter((x) => x.codigo.toLowerCase() !== codigo.toLowerCase()));
  }

  buscar(texto: string): Producto[] {
    const t = texto.trim().toLowerCase();
    if (!t) return this.listar();
    return this.listar().filter(
      (x) =>
        x.nombre.toLowerCase().includes(t) ||
        x.codigo.toLowerCase().includes(t) ||
        x.categoria.toLowerCase().includes(t),
    );
  }

  valorInventario(): number {
    return this.listar().reduce((acc, x) => acc + x.precio * x.stock, 0);
  }

  restablecerDemo(): void {
    this.guardar([...SEMILLA]);
  }

  private cargar(): Producto[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Producto[];
    } catch {
      // si falla, usar semilla
    }
    return [...SEMILLA];
  }

  private guardar(items: Producto[]): void {
    this._productos.next(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // almacenamiento no disponible, se mantiene en memoria
    }
  }
}
