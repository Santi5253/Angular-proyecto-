import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject } from 'rxjs';

export type CategoriaInventario =
  | 'Cigarrillos'
  | 'Bebidas'
  | 'Dulces'
  | 'Abarrotes'
  | 'Licores'
  | 'Otros';

export interface TablaProductosItem {
  codigo: string;
  nombre: string;
  categoria: CategoriaInventario;
  precio: number;
  stock: number;
}

// Inventario real de la cigarrería (luego vendrá del back-end GET /getproductos)
const EXAMPLE_DATA: TablaProductosItem[] = [
  { codigo: 'CIG-001', nombre: 'Pielroja x20', categoria: 'Cigarrillos', precio: 9500, stock: 30 },
  { codigo: 'CIG-002', nombre: 'Marlboro Rojo x20', categoria: 'Cigarrillos', precio: 14500, stock: 20 },
  { codigo: 'CIG-003', nombre: 'Lucky Strike x20', categoria: 'Cigarrillos', precio: 13200, stock: 4 },
  { codigo: 'BEB-001', nombre: 'Pony Malta 330ml', categoria: 'Bebidas', precio: 3500, stock: 48 },
  { codigo: 'BEB-002', nombre: 'Coca-Cola 400ml', categoria: 'Bebidas', precio: 4000, stock: 36 },
  { codigo: 'BEB-003', nombre: 'Agua Cristal 600ml', categoria: 'Bebidas', precio: 3000, stock: 3 },
  { codigo: 'DUL-001', nombre: 'Chocorramo', categoria: 'Dulces', precio: 3500, stock: 25 },
  { codigo: 'DUL-002', nombre: 'Bom Bom Bun Rojo', categoria: 'Dulces', precio: 800, stock: 100 },
  { codigo: 'ABA-001', nombre: 'Papas Margarita 105g', categoria: 'Abarrotes', precio: 6500, stock: 18 },
  { codigo: 'LIC-001', nombre: 'Aguardiente Antioqueño 750ml', categoria: 'Licores', precio: 68000, stock: 8 },
  { codigo: 'LIC-002', nombre: 'Cerveza Poker lata 330ml', categoria: 'Licores', precio: 3500, stock: 60 },
  { codigo: 'OTR-001', nombre: 'Encendedor Bic', categoria: 'Otros', precio: 4000, stock: 15 },
];

/**
 * Data source del inventario: soporta paginación, ordenamiento y filtro
 * interactivo por texto (código, nombre o categoría).
 */
export class TablaProductosDataSource extends DataSource<TablaProductosItem> {
  data: TablaProductosItem[] = EXAMPLE_DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  private filtro$ = new BehaviorSubject<string>('');

  constructor() {
    super();
  }

  setFiltro(texto: string): void {
    this.filtro$.next(texto.trim().toLowerCase());
    this.paginator?.firstPage();
  }

  get valorInventario(): number {
    return this.data.reduce((acc, x) => acc + x.precio * x.stock, 0);
  }

  connect(): Observable<TablaProductosItem[]> {
    if (this.paginator && this.sort) {
      return merge(
        observableOf(this.data),
        this.paginator.page,
        this.sort.sortChange,
        this.filtro$,
      ).pipe(
        map(() => {
          return this.getPagedData(this.getSortedData(this.getFiltrada([...this.data])));
        }),
      );
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  disconnect(): void {}

  private getFiltrada(data: TablaProductosItem[]): TablaProductosItem[] {
    const f = this.filtro$.value;
    if (!f) return data;
    return data.filter(
      (x) =>
        x.codigo.toLowerCase().includes(f) ||
        x.nombre.toLowerCase().includes(f) ||
        x.categoria.toLowerCase().includes(f),
    );
  }

  private getPagedData(data: TablaProductosItem[]): TablaProductosItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  private getSortedData(data: TablaProductosItem[]): TablaProductosItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'codigo':
          return compare(a.codigo, b.codigo, isAsc);
        case 'nombre':
          return compare(a.nombre, b.nombre, isAsc);
        case 'categoria':
          return compare(a.categoria, b.categoria, isAsc);
        case 'precio':
          return compare(a.precio, b.precio, isAsc);
        case 'stock':
          return compare(a.stock, b.stock, isAsc);
        default:
          return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
