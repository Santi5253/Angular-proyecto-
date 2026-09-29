import { Routes } from '@angular/router';
import { FormularioCajaComponent } from './caja/components/formulario-caja/formulario-caja.component';
import { TablaProductosComponent } from './caja/components/tabla-productos/tabla-productos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'formulario', pathMatch: 'full' },
  { path: 'formulario', component: FormularioCajaComponent },
  { path: 'tabla', component: TablaProductosComponent },
];
