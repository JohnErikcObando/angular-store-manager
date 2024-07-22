import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

// interfaces
import { CreateImpuestoDTO, Impuesto, UpdateImpuestoDTO } from 'app/interfaces';

import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImpuestoService {
  private apiUrl = `${environment.apiUrl}/impuesto`;

  constructor(private http: HttpClient) {}

  create(dto: CreateImpuestoDTO) {
    return this.http.post<Impuesto>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateImpuestoDTO) {
    return this.http.put<Impuesto>(`${this.apiUrl}/${id}`, dto);
  }

  patch(id: string, dto: UpdateImpuestoDTO) {
    return this.http.patch<Impuesto>(`${this.apiUrl}/${id}/usuariomodif`, dto);
  }

  delete(id: string) {
    return this.http.delete<Impuesto>(`${this.apiUrl}/${id}`);
  }

  getAll() {
    return this.http.get<Impuesto[]>(this.apiUrl);
  }

  get(id: string) {
    return this.http.get<Impuesto>(`${this.apiUrl}/${id}`).pipe(
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

  findByImpuesto(nombre: string) {
    return this.http
      .get<Impuesto>(`${this.apiUrl}/byImpuesto`, {
        params: { nombre },
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
