import { Routes } from '@angular/router';

import { FormFacturaCompraComponent } from './factura-compra/components/form-factura-compra/form-factura-compra.component';
import { FormFacturaVentasComponent } from './factura-venta/components/form-factura-ventas/form-factura-ventas.component';
import { FacturaComprasComponent } from './factura-compra/components/factura-compras/factura-compras.component';
import { FacturaVentasComponent } from './factura-venta/components/factura-ventas/factura-ventas.component';

export const routes: Routes = [
  {
    path: 'factura-compra',
    component: FormFacturaCompraComponent,
  },
  {
    path: 'lista-factura-compra',
    component: FacturaComprasComponent,
  },
  {
    path: 'factura-venta',
    component: FormFacturaVentasComponent,
  },
  {
    path: 'lista-factura-venta',
    component: FacturaVentasComponent,
  },
];
