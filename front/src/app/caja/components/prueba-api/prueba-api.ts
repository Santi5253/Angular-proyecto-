// front/src/app/caja/components/prueba-api/prueba-api.ts (archivo de prueba)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosApiService } from '../../services/productos-api.service';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-prueba-api',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3>Prueba consumo API</h3>
    <pre>{{ productos | json }}</pre>
  `,
  styleUrl: './prueba-api.css',
})
export class PruebaApi implements OnInit {
  productos: Producto[] = [];

  constructor(private productosApi: ProductosApiService) {}

  ngOnInit(): void {
    this.productosApi.getProductos().subscribe({
      next: (data) => {
        console.log('Datos desde API:', data);
        this.productos = data;
      },
      error: (err) => {
        console.error('Error al consumir API:', err);
      }
    });
  }
}