import { Routes } from '@angular/router';
import { authGuard } from '@core';

import { AdminLayoutComponent } from '@theme/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from '@theme/auth-layout/auth-layout.component';

import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { Error403Component } from './routes/sessions/403.component';
import { Error404Component } from './routes/sessions/404.component';
import { Error500Component } from './routes/sessions/500.component';
import { LoginComponent } from './routes/sessions/login/login.component';
import { RegisterComponent } from './routes/sessions/register/register.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: '403', component: Error403Component },
      { path: '404', component: Error404Component },
      { path: '500', component: Error500Component },
      {
        path: 'admin',
        loadChildren: () => import('./routes/admin/admin.routes').then(m => m.routes),
      },
      {
        path: 'configuracion',
        loadChildren: () =>
          import('./routes/configuracion/configuracion.routes').then(m => m.routes),
      },

      {
        path: 'factura',
        loadChildren: () => import('./routes/factura/factura.routes').then(m => m.routes),
      },

      {
        path: 'movimiento',
        loadChildren: () => import('./routes/movimiento/movimiento.routes').then(m => m.routes),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  { path: '**', redirectTo: 'movimiento' },
];
