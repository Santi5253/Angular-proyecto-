// front/src/app/caja/services/productos-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root',
})
export class ProductosApiService {
  // Prefijo versionado /api/v1 (unica fuente de verdad: PostgreSQL)
  private readonly url = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.url}/productos`);
  }

  getProductoPorCodigo(codigo: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}/productos/${codigo}`);
  }

  crearProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(`${this.url}/productos`, producto);
  }

  actualizarProducto(codigo: string, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.url}/productos/${codigo}`, producto);
  }

  eliminarProducto(codigo: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/productos/${codigo}`);
  }
}
