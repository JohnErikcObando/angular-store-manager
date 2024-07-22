import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

// interfaces
import { CreateMarcaDTO, Marca, UpdateMarcaDTO } from 'app/interfaces';

import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MarcaService {
  private apiUrl = `${environment.apiUrl}/marca`;

  constructor(private http: HttpClient) {}

  create(dto: CreateMarcaDTO) {
    return this.http.post<Marca>(this.apiUrl, dto);
  }

  update(id: number, dto: UpdateMarcaDTO) {
    return this.http.put<Marca>(`${this.apiUrl}/${id}`, dto);
  }

  patch(id: number, dto: UpdateMarcaDTO) {
    return this.http.patch<Marca>(`${this.apiUrl}/${id}/usuariomodif`, dto);
  }

  delete(id: number) {
    return this.http.delete<Marca>(`${this.apiUrl}/${id}`);
  }

  getAll() {
    return this.http.get<Marca[]>(this.apiUrl);
  }

  get(id: number) {
    return this.http.get<Marca>(`${this.apiUrl}/${id}`).pipe(
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

  findByMarca(nombre: string) {
    return this.http
      .get<Marca>(`${this.apiUrl}/byMarca`, {
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
