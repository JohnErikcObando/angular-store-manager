import { Routes } from '@angular/router';

import { FormFacturaCompraComponent } from './factura-compra/components/form-factura-compra/form-factura-compra.component';
import { FormFacturaVentasComponent } from './factura-venta/components/form-factura-ventas/form-factura-ventas.component';

export const routes: Routes = [
  {
    path: 'factura-compra',
    component: FormFacturaCompraComponent,
  },
  {
    path: 'factura-venta',
    component: FormFacturaVentasComponent,
  },
];
