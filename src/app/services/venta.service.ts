import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { environment } from '@env/environment';

// interface
import { DetalleVenta } from 'app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private apiUrl = `${environment.apiUrl}/venta`;

  constructor(private http: HttpClient) {}

  findByDetalle(facturaId: string) {
    return this.http
      .get<DetalleVenta[]>(`${this.apiUrl}/byFactura`, {
        params: { facturaVentaId: facturaId },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.NotFound) {
            // Manejar el error 404 aquí, por ejemplo, devolver un valor predeterminado
            return throwError(() => ({ isAvailable: true }));
          }
          // Otros errores pueden manejarse según sea necesario
          return throwError(() => new Error('Error en la solicitud'));
        })
      );
  }
}
