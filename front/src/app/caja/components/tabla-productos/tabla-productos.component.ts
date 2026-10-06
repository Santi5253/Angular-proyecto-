import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { Producto } from '../../models/producto';
import { Productos } from '../../services/productos';

@Component({
  selector: 'app-tabla-productos',
  templateUrl: './tabla-productos.component.html',
  styleUrl: './tabla-productos.component.css',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule],
})
export class TablaProductosComponent implements OnInit, AfterViewInit {
  private servicio = inject(Productos);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Mismo inventario único que Inventario y Factura (servicio Productos)
  dataSource = new MatTableDataSource<Producto>([]);

  /** Columnas del inventario de la cigarrería */
  displayedColumns = ['codigo', 'nombre', 'categoria', 'precio', 'stock', 'estado', 'total'];

  ngOnInit(): void {
    this.servicio.productos$.subscribe((items) => {
      this.dataSource.data = items;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (p, filtro) => {
      const f = filtro.trim().toLowerCase();
      return (
        p.codigo.toLowerCase().includes(f) ||
        p.nombre.toLowerCase().includes(f) ||
        p.categoria.toLowerCase().includes(f)
      );
    };
  }

  aplicarFiltro(valor: string): void {
    this.dataSource.filter = valor.trim().toLowerCase();
    this.dataSource.paginator?.firstPage();
  }

  estado(stock: number): string {
    if (stock <= 5) return 'CRÍTICO';
    if (stock <= 15) return 'BAJO';
    return 'OK';
  }

  get valorInventario(): number {
    return this.servicio.valorInventario();
  }
}
