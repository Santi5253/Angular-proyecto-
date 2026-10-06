import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { CategoriaTienda, Producto } from '../../models/producto';
import { Productos } from '../../services/productos';

@Component({
  selector: 'app-inventario',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
  ],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
})
export class Inventario implements OnInit {
  private fb = inject(FormBuilder);
  private servicio = inject(Productos);

  categorias: CategoriaTienda[] = [
    'Cigarrillos',
    'Bebidas',
    'Dulces',
    'Abarrotes',
    'Licores',
    'Otros',
  ];

  displayedColumns = ['codigo', 'nombre', 'categoria', 'precio', 'stock', 'total', 'acciones'];

  productos: Producto[] = [];
  editando: string | null = null;
  error = '';
  filtro = '';

  form = this.fb.group({
    codigo: ['', [Validators.required, Validators.minLength(3)]],
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    categoria: ['Bebidas' as CategoriaTienda, Validators.required],
    precio: [0, [Validators.required, Validators.min(100)]],
    stock: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.refrescar();
  }

  refrescar(): void {
    this.productos = this.servicio.buscar(this.filtro);
  }

  guardar(): void {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const valor = this.form.getRawValue();
    const producto: Producto = {
      codigo: valor.codigo!.trim().toUpperCase(),
      nombre: valor.nombre!.trim(),
      categoria: valor.categoria!,
      precio: Number(valor.precio),
      stock: Number(valor.stock),
    };
    try {
      if (this.editando) {
        this.servicio.actualizar(this.editando, producto);
      } else {
        this.servicio.crear(producto);
      }
      this.cancelar();
      this.refrescar();
    } catch (e: unknown) {
      this.error = e instanceof Error ? e.message : 'No se pudo guardar';
    }
  }

  editar(p: Producto): void {
    this.editando = p.codigo;
    this.form.setValue({
      codigo: p.codigo,
      nombre: p.nombre,
      categoria: p.categoria,
      precio: p.precio,
      stock: p.stock,
    });
  }

  eliminar(codigo: string): void {
    if (!confirm(`¿Eliminar ${codigo} del inventario?`)) return;
    this.servicio.eliminar(codigo);
    if (this.editando === codigo) this.cancelar();
    this.refrescar();
  }

  cancelar(): void {
    this.editando = null;
    this.error = '';
    this.form.reset({ categoria: 'Bebidas' as CategoriaTienda, precio: 0, stock: 0 });
  }

  get valorInventario(): number {
    return this.servicio.valorInventario();
  }
}
