import { Routes } from '@angular/router';
import { FacturaComprasComponent } from './factura-compra/components/factura-compras/factura-compras.component';
import { FacturaVentasComponent } from './factura-venta/components/factura-ventas/factura-ventas.component';

export const routes: Routes = [
  {
    path: 'factura-compra',
    component: FacturaComprasComponent,
  },
  {
    path: 'factura-venta',
    component: FacturaVentasComponent,
  },
];
