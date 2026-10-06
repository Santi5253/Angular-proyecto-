import { Routes } from '@angular/router';
import { FormularioCajaComponent } from './caja/components/formulario-caja/formulario-caja.component';
import { ProductoCrud } from './caja/components/producto-crud/producto-crud';
import { TablaProductosComponent } from './caja/components/tabla-productos/tabla-productos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  { path: 'productos', component: ProductoCrud },
  { path: 'formulario', component: FormularioCajaComponent },
  { path: 'tabla', component: TablaProductosComponent },
];
