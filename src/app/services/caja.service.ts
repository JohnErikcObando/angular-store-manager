import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

// interfaces
import { Caja, CreateCajaDTO, UpdateCajaDTO } from 'app/interfaces';

import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CajaService {
  private apiUrl = `${environment.apiUrl}/caja`;

  constructor(private http: HttpClient) {}

  create(dto: CreateCajaDTO) {
    return this.http.post<Caja>(this.apiUrl, dto);
  }

  update(id: number, dto: UpdateCajaDTO) {
    return this.http.put<Caja>(`${this.apiUrl}/${id}`, dto);
  }

  patch(id: number, dto: UpdateCajaDTO) {
    return this.http.patch<Caja>(`${this.apiUrl}/${id}/usuariomodif`, dto);
  }

  delete(id: number) {
    return this.http.delete<Caja>(`${this.apiUrl}/${id}`);
  }

  getAll() {
    return this.http.get<Caja[]>(this.apiUrl);
  }

  get(id: number) {
    return this.http.get<Caja>(`${this.apiUrl}/${id}`).pipe(
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

  findByCaja(nombre: string) {
    return this.http
      .get<Caja>(`${this.apiUrl}/byCaja`, {
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
