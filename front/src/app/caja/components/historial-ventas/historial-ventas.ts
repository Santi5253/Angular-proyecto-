import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

interface Venta {
  id: number;
  fecha: string;
  cliente: string;
  documento: string;
  medio_pago: string;
  subtotal: number;
  descuento: number;
  total: number;
}

@Component({
  selector: 'app-historial-ventas',
  standalone: true,
  imports: [MatTableModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatChipsModule, DatePipe],
  templateUrl: './historial-ventas.html',
  styleUrl: './historial-ventas.css',
})
export class HistorialVentas implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private readonly url = 'http://localhost:3000/api/v1/ventas';

  ventas: Venta[] = [];
  filtro = '';
  displayedColumns = ['id', 'fecha', 'cliente', 'medio_pago', 'total'];

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.http.get<Venta[]>(this.url).subscribe({
      next: (data) => {
        this.ventas = data ?? [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.ventas = [];
        this.cdr.detectChanges();
      },
    });
  }

  get ventasHoy(): Venta[] {
    const hoy = new Date().toISOString().slice(0, 10);
    return this.ventas.filter((v) => v.fecha.slice(0, 10) === hoy);
  }

  get ventasFiltradas(): Venta[] {
    const base = this.ventasHoy;
    const t = this.filtro.trim().toLowerCase();
    if (!t) return base;
    return base.filter((v) =>
      v.cliente.toLowerCase().includes(t) ||
      v.medio_pago.toLowerCase().includes(t) ||
      String(v.id).includes(t)
    );
  }

  get totalHoy(): number {
    return this.ventasHoy.reduce((acc, v) => acc + Number(v.total), 0);
  }

  get cantidadHoy(): number {
    return this.ventasHoy.length;
  }
}
