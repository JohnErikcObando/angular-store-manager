import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { environment } from '@env/environment';

// interfaces
import { CreateMovimientoDTO, Movimiento, UpdateMovimientoDTO } from 'app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class MovimientoService {
  private apiUrl = `${environment.apiUrl}/movimiento`;

  constructor(private http: HttpClient) {}

  create(dto: CreateMovimientoDTO) {
    return this.http.post<Movimiento>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateMovimientoDTO) {
    return this.http.put<Movimiento>(`${this.apiUrl}/${id}`, dto);
  }

  patch(id: string, dto: UpdateMovimientoDTO) {
    return this.http.patch<Movimiento>(`${this.apiUrl}/${id}/usuariomodif`, dto);
  }

  delete(id: string) {
    return this.http.delete<Movimiento>(`${this.apiUrl}/${id}`);
  }

  getAll() {
    return this.http.get<Movimiento[]>(this.apiUrl);
  }

  get(id: string) {
    return this.http.get<Movimiento>(`${this.apiUrl}/${id}`).pipe(
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
