// front/src/app/caja/services/productos-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root',
})
export class ProductosApiService {
  // Usa las rutas VERBALES que YA existen para NO romper nada
  private readonly url = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.url}/getproductos`);
  }

  getProductoPorCodigo(codigo: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}/getproductos/${codigo}`);
  }

  crearProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(`${this.url}/postproductos`, producto);
  }

  actualizarProducto(codigo: string, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.url}/putproductos/${codigo}`, producto);
  }

  eliminarProducto(codigo: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/deleteproductos/${codigo}`);
  }
}