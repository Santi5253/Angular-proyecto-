import { Routes } from '@angular/router';
import { FacturaCaja } from './caja/components/factura/factura';
import { Inventario } from './caja/components/inventario/inventario';
import { Dashboard } from './caja/components/dashboard/dashboard';
import { Login } from './caja/components/login/login';
import { HistorialVentas } from './caja/components/historial-ventas/historial-ventas';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', redirectTo: 'inventario', pathMatch: 'full' },
  { path: 'inventario', component: Inventario, canActivate: [authGuard] },
  { path: 'factura', component: FacturaCaja, canActivate: [authGuard] },
  { path: 'historial', component: HistorialVentas, canActivate: [authGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
];
