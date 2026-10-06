import { Component, inject } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';

export type MedioPago = 'Efectivo' | 'Tarjeta' | 'Nequi' | 'Daviplata';

@Component({
  selector: 'app-formulario-caja',
  templateUrl: './formulario-caja.component.html',
  styleUrl: './formulario-caja.component.css',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
  ],
})
export class FormularioCajaComponent {
  private fb = inject(FormBuilder);

  // Catálogo rápido de la cigarrería (luego vendrá del back-end /getproductos)
  productos = [
    { codigo: 'CIG-001', nombre: 'Pielroja x20', precio: 9500 },
    { codigo: 'CIG-002', nombre: 'Marlboro Rojo x20', precio: 14500 },
    { codigo: 'BEB-001', nombre: 'Pony Malta 330ml', precio: 3500 },
    { codigo: 'BEB-002', nombre: 'Coca-Cola 400ml', precio: 4000 },
    { codigo: 'DUL-001', nombre: 'Chocorramo', precio: 3500 },
    { codigo: 'ABA-001', nombre: 'Papas Margarita 105g', precio: 6500 },
  ];

  medios: MedioPago[] = ['Efectivo', 'Tarjeta', 'Nequi', 'Daviplata'];

  ventaForm = this.fb.group({
    cliente: ['', Validators.required],
    documento: ['', [Validators.required, Validators.minLength(5)]],
    productoCodigo: ['', Validators.required],
    cantidad: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
    medioPago: ['Efectivo' as MedioPago, Validators.required],
    descuento: [0, [Validators.min(0), Validators.max(50)]],
  });

  ticket: string | null = null;

  get productoSeleccionado() {
    const cod = this.ventaForm.controls.productoCodigo.value;
    return this.productos.find((p) => p.codigo === cod) ?? null;
  }

  get subtotal(): number {
    if (!this.productoSeleccionado) return 0;
    const cant = Number(this.ventaForm.controls.cantidad.value ?? 0);
    return this.productoSeleccionado.precio * cant;
  }

  get total(): number {
    const desc = Number(this.ventaForm.controls.descuento.value ?? 0);
    return Math.round(this.subtotal * (1 - desc / 100));
  }

  onSubmit(): void {
    if (this.ventaForm.invalid) {
      this.ventaForm.markAllAsTouched();
      return;
    }
    const v = this.ventaForm.getRawValue();
    // POST futuro: POST /ventas con este cuerpo (ver back-end/src/routes)
    this.ticket =
      `Venta registrada — Cliente: ${v.cliente} (${v.documento}) | ` +
      `${this.productoSeleccionado?.nombre} x${v.cantidad} | ` +
      `Subtotal $${this.subtotal} - Desc ${v.descuento}% = TOTAL $${this.total} | Pago: ${v.medioPago}`;
  }

  limpiar(): void {
    this.ventaForm.reset({ cantidad: 1, medioPago: 'Efectivo' as MedioPago, descuento: 0 });
    this.ticket = null;
  }
}
