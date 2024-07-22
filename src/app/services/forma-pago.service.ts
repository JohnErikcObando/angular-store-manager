import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

// interfaces
import { CreateFormaPagoDTO, FormaPago, UpdateFormaPagoDTO } from 'app/interfaces';

import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormaPagoService {
  private apiUrl = `${environment.apiUrl}/formaPago`;

  constructor(private http: HttpClient) {}

  create(dto: CreateFormaPagoDTO) {
    return this.http.post<FormaPago>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateFormaPagoDTO) {
    return this.http.put<FormaPago>(`${this.apiUrl}/${id}`, dto);
  }

  patch(id: number, dto: UpdateFormaPagoDTO) {
    return this.http.patch<FormaPago>(`${this.apiUrl}/${id}/usuariomodif`, dto);
  }

  delete(id: number) {
    return this.http.delete<FormaPago>(`${this.apiUrl}/${id}`);
  }

  getAll() {
    return this.http.get<FormaPago[]>(this.apiUrl);
  }

  get(id: string) {
    return this.http.get<FormaPago>(`${this.apiUrl}/${id}`).pipe(
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

  findByFormaPago(nombre: string) {
    return this.http
      .get<FormaPago>(`${this.apiUrl}/byFormaPago`, {
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
