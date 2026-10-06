import { Routes } from '@angular/router';
import { Inventario } from './caja/components/inventario/inventario';
import { TablaProductosComponent } from './caja/components/tabla-productos/tabla-productos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'inventario', pathMatch: 'full' },
  { path: 'inventario', component: Inventario },
  { path: 'tabla', component: TablaProductosComponent },
];
