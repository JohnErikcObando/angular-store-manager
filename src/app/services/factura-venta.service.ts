import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

// interfaces
import { CreateFacturaVentaDTO, FacturaVenta, UpdateFacturaVentaDTO } from 'app/interfaces';

import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FacturaVentaService {
  private apiUrl = `${environment.apiUrl}/facturaVenta`;

  constructor(private http: HttpClient) {}

  create(dto: CreateFacturaVentaDTO) {
    return this.http.post<FacturaVenta>(this.apiUrl, dto);
  }

  update(id: number, dto: UpdateFacturaVentaDTO) {
    return this.http.put<FacturaVenta>(`${this.apiUrl}/${id}`, dto);
  }

  patch(id: number, dto: UpdateFacturaVentaDTO) {
    return this.http.patch<FacturaVenta>(`${this.apiUrl}/${id}/usuariomodif`, dto);
  }

  delete(id: number) {
    return this.http.delete<FacturaVenta>(`${this.apiUrl}/${id}`);
  }

  getAll() {
    return this.http.get<FacturaVenta[]>(this.apiUrl);
  }

  get(id: string) {
    return this.http.get<FacturaVenta>(`${this.apiUrl}/${id}`).pipe(
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
