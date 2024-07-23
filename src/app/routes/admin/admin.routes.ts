import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { EmpresaComponent } from './empresa/empresa.component';
import { UsuariosComponent } from './usuario/components/usuarios/usuarios.component';
import { CajaComponent } from './caja/components/caja/caja.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'empresa',
    component: EmpresaComponent,
  },
  {
    path: 'usuario',
    component: UsuariosComponent,
  },
  {
    path: 'caja',
    component: CajaComponent,
  },
];
