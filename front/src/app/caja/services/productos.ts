import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../models/producto';

// Servicio unico de inventario: la fuente de verdad es el backend (PostgreSQL).
// Se mantiene una cache en memoria para que la UI siga siendo sincrona.
@Injectable({
  providedIn: 'root',
})
export class Productos {
  private http = inject(HttpClient);
  private readonly base = 'http://localhost:3000/api/v1';

  private readonly _productos = new BehaviorSubject<Producto[]>([]);
  readonly productos$ = this._productos.asObservable();

  constructor() {
    this.refrescarServidor();
  }

  listar(): Producto[] {
    return [...this._productos.value];
  }

  crear(p: Producto): void {
    const actual = this.listar();
    if (actual.some((x) => x.codigo.toLowerCase() === p.codigo.toLowerCase())) {
      throw new Error(`Ya existe un producto con código ${p.codigo}`);
    }
    // Actualizacion optimista de la cache
    this._productos.next([...actual, p]);
    this.http.post<Producto>(`${this.base}/productos`, p).subscribe({
      error: () => this.refrescarServidor(),
    });
  }

  actualizar(codigo: string, cambios: Producto): void {
    const actual = this._productos.value.map((x) =>
      x.codigo.toLowerCase() === codigo.toLowerCase() ? { ...cambios, codigo: x.codigo } : x,
    );
    this._productos.next(actual);
    this.http.put<Producto>(`${this.base}/productos/${codigo}`, cambios).subscribe({
      error: () => this.refrescarServidor(),
    });
  }

  eliminar(codigo: string): void {
    this._productos.next(
      this._productos.value.filter((x) => x.codigo.toLowerCase() !== codigo.toLowerCase()),
    );
    this.http.delete(`${this.base}/productos/${codigo}`).subscribe({
      error: () => this.refrescarServidor(),
    });
  }

  descontar(items: { codigo: string; cantidad: number }[]): void {
    const actual = this._productos.value.map((x) => {
      const item = items.find((i) => i.codigo.toLowerCase() === x.codigo.toLowerCase());
      if (!item) return x;
      const actualizado = { ...x, stock: Math.max(0, x.stock - item.cantidad) };
      this.http.put<Producto>(`${this.base}/productos/${x.codigo}`, actualizado).subscribe({
        error: () => this.refrescarServidor(),
      });
      return actualizado;
    });
    this._productos.next(actual);
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
    this.refrescarServidor();
  }

  refrescarServidor(): void {
    this.http.get<Producto[]>(`${this.base}/productos`).subscribe({
      next: (data) => this._productos.next(data ?? []),
      error: () => this._productos.next([]),
    });
  }
}
