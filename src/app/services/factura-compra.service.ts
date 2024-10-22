import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

// interfaces
import { CreateFacturaCompraDTO, FacturaCompra, UpdateFacturaCompraDTO } from 'app/interfaces';

import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FacturaCompraService {
  private apiUrl = `${environment.apiUrl}/facturaCompra`;

  constructor(private http: HttpClient) {}

  create(dto: CreateFacturaCompraDTO) {
    return this.http.post<FacturaCompra>(this.apiUrl, dto);
  }

  update(id: number, dto: UpdateFacturaCompraDTO) {
    return this.http.put<FacturaCompra>(`${this.apiUrl}/${id}`, dto);
  }

  patch(id: number, dto: UpdateFacturaCompraDTO) {
    return this.http.patch<FacturaCompra>(`${this.apiUrl}/${id}/usuariomodif`, dto);
  }

  delete(id: number) {
    return this.http.delete<FacturaCompra>(`${this.apiUrl}/${id}`);
  }

  getAll(startOfMonth: Date, endOfMonth: Date) {
    const params = {
      fechaInicio: startOfMonth.toISOString(),
      fechaFin: endOfMonth.toISOString(),
    };

    return this.http.get<FacturaCompra[]>(this.apiUrl, { params });
  }

  get(id: number) {
    return this.http.get<FacturaCompra>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        // Manejo de errores
        if (error.status === HttpStatusCode.Conflict) {
          return throwError(() => new Error('Algo esta fallando en el servidor'));
        }
        if (error.status === HttpStatusCode.NotFound) {
          return throwError(() => new Error('No existe'));
        }
        if (error.status === HttpStatusCode.Unauthorized) {
          return throwError(() => new Error('No estas permitido'));
        }
        return throwError(() => new Error('Ups, algo salió mal'));
      })
    );
  }
}
