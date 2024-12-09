import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from './../../environments/environment';

import {
  MovimientoTipoMes,
  ProductosVendidosPorMes,
  VentasPorDia,
  VentasPorMes,
  VentasPorSemana,
} from 'app/interfaces';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashBoardService {
  private apiUrl = `${environment.apiUrl}/dashBoard/`;

  private http = inject(HttpClient);

  constructor() {}

  getMovimientosMes() {
    const url = `${this.apiUrl}/movimientos-tipo-mes`;
    return this.http.get<MovimientoTipoMes[]>(url).pipe(retry(3));
  }

  getCategoriaMes() {
    const url = `${this.apiUrl}/categoria-mes`;
    return this.http.get<MovimientoTipoMes[]>(url).pipe(retry(3));
  }

  getProductosMes() {
    const url = `${this.apiUrl}/productos-mas-vendidos-por-mes`;
    return this.http.get<ProductosVendidosPorMes[]>(url).pipe(retry(3));
  }

  getVentasDia() {
    const url = `${this.apiUrl}/ventas-por-dia`;
    return this.http.get<VentasPorDia[]>(url).pipe(retry(3));
  }

  getVentasMes() {
    const url = `${this.apiUrl}/ventas-por-mes`;
    return this.http.get<VentasPorMes[]>(url).pipe(retry(3));
  }

  getVentasSemana() {
    const url = `${this.apiUrl}/ventas-por-semana`;
    return this.http.get<VentasPorSemana[]>(url).pipe(retry(3));
  }
}
