import { Routes } from '@angular/router';

import { CategoriasComponent } from './categoria/components/categorias/categorias.component';
import { ClientesComponent } from './cliente/components/clientes/clientes.component';
import { FormaPagosComponent } from './forma-pago/components/forma-pagos/forma-pagos.component';
import { ImpuestosComponent } from './impuesto/components/impuestos/impuestos.component';
import { MarcaComponent } from './marca/components/marca/marca.component';
import { ProductosComponent } from './producto/components/productos/productos.component';
import { ProveedoresComponent } from './proveedor/components/proveedores/proveedores.component';

export const routes: Routes = [
  {
    path: 'categoria',
    component: CategoriasComponent,
  },
  {
    path: 'cliente',
    component: ClientesComponent,
  },
  {
    path: 'forma-pago',
    component: FormaPagosComponent,
  },
  {
    path: 'impuesto',
    component: ImpuestosComponent,
  },
  {
    path: 'producto',
    component: ProductosComponent,
  },
  {
    path: 'proveedor',
    component: ProveedoresComponent,
  },
  {
    path: 'marca',
    component: MarcaComponent,
  },
];
