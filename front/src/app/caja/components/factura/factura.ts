import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import QRCode from 'qrcode';
import { Producto } from '../../models/producto';
import { Productos } from '../../services/productos';

export type MedioPago = 'Efectivo' | 'Tarjeta' | 'Nequi' | 'Daviplata';

export interface LineaFactura {
  producto: Producto;
  cantidad: number;
}

export interface Factura {
  numero: string;
  fecha: Date;
  cliente: string;
  documento: string;
  lineas: LineaFactura[];
  subtotal: number;
  descuento: number;
  total: number;
  medioPago: MedioPago;
}

// Números demo del negocio (luego vienen del back-end)
const BILLETERAS: Record<string, string> = {
  Nequi: '3001234567',
  Daviplata: '3209876543',
};

const SEQ_KEY = 'caja_factura_seq';

@Component({
  selector: 'app-factura',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatTableModule,
  ],
  templateUrl: './factura.html',
  styleUrl: './factura.css',
})
export class FacturaCaja implements OnInit {
  private fb = inject(FormBuilder);
  private servicio = inject(Productos);

  medios: MedioPago[] = ['Efectivo', 'Tarjeta', 'Nequi', 'Daviplata'];
  carrito: LineaFactura[] = [];
  factura: Factura | null = null;
  error = '';
  qrUrl = '';

  colsCarrito = ['producto', 'precio', 'cantidad', 'subtotal', 'acciones'];

  datosForm = this.fb.group({
    cliente: ['', Validators.required],
    documento: ['', [ Validators.minLength(1), Validators.maxLength(10)]],
    descuento: [0, [Validators.min(0), Validators.max(100)]],
  });

  lineaForm = this.fb.group({
    productoCodigo: ['', Validators.required],
    cantidad: [1, [Validators.required, Validators.min(1)]],
  });

  pagoForm = this.fb.group({
    medio: ['Efectivo' as MedioPago, Validators.required],
    // Efectivo
    recibido: [0],
    // Tarjeta
    tarjetaNumero: [''],
    tarjetaTitular: [''],
    tarjetaCvv: [''],
    // Billeteras
    referencia: [''],
  });

  ngOnInit(): void {
    this.onMedioChange();
  }

  get catalogo(): Producto[] {
    return this.servicio.listar();
  }

  get subtotal(): number {
    return this.carrito.reduce((acc, l) => acc + l.producto.precio * l.cantidad, 0);
  }

  get total(): number {
    const desc = Number(this.datosForm.controls.descuento.value ?? 0);
    return Math.round(this.subtotal * (1 - desc / 100));
  }

  get cambio(): number {
    return Number(this.pagoForm.controls.recibido.value ?? 0) - this.total;
  }

  agregarLinea(): void {
    this.error = '';
    if (this.lineaForm.invalid) {
      this.lineaForm.markAllAsTouched();
      return;
    }
    const cod = this.lineaForm.controls.productoCodigo.value!;
    const cant = Number(this.lineaForm.controls.cantidad.value);
    const prod = this.servicio.listar().find((p) => p.codigo === cod);
    if (!prod) {
      this.error = 'Producto no encontrado en el inventario';
      return;
    }
    const enCarrito = this.carrito.find((l) => l.producto.codigo === cod)?.cantidad ?? 0;
    if (enCarrito + cant > prod.stock) {
      this.error = `Stock insuficiente de ${prod.nombre}: hay ${prod.stock}, ya lleva ${enCarrito} en la factura`;
      return;
    }
    const existente = this.carrito.find((l) => l.producto.codigo === cod);
    if (existente) {
      existente.cantidad += cant;
    } else {
      this.carrito.push({ producto: prod, cantidad: cant });
    }
    this.lineaForm.reset({ productoCodigo: '', cantidad: 1 });
  }

  quitarLinea(codigo: string): void {
    this.carrito = this.carrito.filter((l) => l.producto.codigo !== codigo);
  }

  async onMedioChange(): Promise<void> {
    this.qrUrl = '';
    const medio = this.pagoForm.controls.medio.value!;
    if (medio === 'Nequi' || medio === 'Daviplata') {
      const numero = BILLETERAS[medio];
      const contenido = `${medio}::${numero}::TIENDA-CIGARRERIA`;
      try {
        this.qrUrl = await QRCode.toDataURL(contenido, { width: 180, margin: 1 });
      } catch {
        this.qrUrl = '';
      }
    }
  }

  numeroBilletera(medio: string): string {
    return BILLETERAS[medio] ?? '';
  }

  private validarPago(): string | null {
    const medio = this.pagoForm.controls.medio.value!;
    if (medio === 'Efectivo') {
      if (this.cambio < 0) return `El valor recibido no cubre el total ($${this.total})`;
    }
    if (medio === 'Tarjeta') {
      const num = (this.pagoForm.controls.tarjetaNumero.value ?? '').replace(/\s/g, '');
      if (!/^\d{16}$/.test(num)) return 'La tarjeta debe tener 16 dígitos';
      if (!(this.pagoForm.controls.tarjetaTitular.value ?? '').trim())
        return 'El titular de la tarjeta es obligatorio';
      if (!/^\d{3,4}$/.test(this.pagoForm.controls.tarjetaCvv.value ?? ''))
        return 'El CVV debe tener 3 o 4 dígitos';
    }
    if (medio === 'Nequi' || medio === 'Daviplata') {
      if ((this.pagoForm.controls.referencia.value ?? '').trim().length < 6)
        return `Digite la referencia de aprobación de ${medio} (mínimo 6 caracteres)`;
    }
    return null;
  }

  confirmar(): void {
    this.error = '';
    if (this.datosForm.invalid) {
      this.datosForm.markAllAsTouched();
      return;
    }
    if (!this.carrito.length) {
      this.error = 'Agregue al menos un producto a la factura';
      return;
    }
    const msgPago = this.validarPago();
    if (msgPago) {
      this.error = msgPago;
      return;
    }
    const datos = this.datosForm.getRawValue();
    const pago = this.pagoForm.getRawValue();
    const seq = Number(localStorage.getItem(SEQ_KEY) ?? 0) + 1;
    localStorage.setItem(SEQ_KEY, String(seq));

    this.factura = {
      numero: `FAC-${String(seq).padStart(5, '0')}`,
      fecha: new Date(),
      cliente: datos.cliente!,
      documento: datos.documento!,
      lineas: this.carrito.map((l) => ({ ...l })),
      subtotal: this.subtotal,
      descuento: Number(datos.descuento ?? 0),
      total: this.total,
      medioPago: pago.medio!,
    };

    // Descuenta del inventario único (se refleja en Inventario y Tabla)
    this.servicio.descontar(this.carrito.map((l) => ({ codigo: l.producto.codigo, cantidad: l.cantidad })));
    this.carrito = [];
  }

  nuevaFactura(): void {
    this.factura = null;
    this.error = '';
    this.datosForm.reset({ descuento: 0 });
    this.pagoForm.reset({ medio: 'Efectivo' as MedioPago, recibido: 0 });
    this.onMedioChange();
  }
}
