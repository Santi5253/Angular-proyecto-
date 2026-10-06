import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { TablaProductosDataSource, TablaProductosItem } from './tabla-productos-datasource';

@Component({
  selector: 'app-tabla-productos',
  templateUrl: './tabla-productos.component.html',
  styleUrl: './tabla-productos.component.css',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule],
})
export class TablaProductosComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TablaProductosItem>;
  dataSource = new TablaProductosDataSource();

  /** Columnas del inventario de la cigarrería */
  displayedColumns = ['codigo', 'nombre', 'categoria', 'precio', 'stock', 'estado', 'total'];

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  aplicarFiltro(valor: string): void {
    this.dataSource.setFiltro(valor);
  }

  estado(stock: number): string {
    if (stock <= 5) return 'CRÍTICO';
    if (stock <= 15) return 'BAJO';
    return 'OK';
  }
}
