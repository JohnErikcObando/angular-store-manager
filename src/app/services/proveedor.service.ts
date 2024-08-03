import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

// interfaces
import { CreateProveedorDTO, Proveedor, UpdateProveedorDTO } from 'app/interfaces';

import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
  private apiUrl = `${environment.apiUrl}/proveedor`;

  constructor(private http: HttpClient) {}

  create(dto: CreateProveedorDTO) {
    return this.http.post<Proveedor>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateProveedorDTO) {
    return this.http.put<Proveedor>(`${this.apiUrl}/${id}`, dto);
  }

  patch(id: string, dto: UpdateProveedorDTO) {
    return this.http.patch<Proveedor>(`${this.apiUrl}/${id}/usuariomodif`, dto);
  }

  delete(id: string) {
    return this.http.delete<Proveedor>(`${this.apiUrl}/${id}`);
  }

  getAll() {
    return this.http.get<Proveedor[]>(this.apiUrl);
  }

  get(id: string) {
    return this.http.get<Proveedor>(`${this.apiUrl}/${id}`).pipe(
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

  findByProveedor(nombre: string) {
    return this.http
      .get<Proveedor>(`${this.apiUrl}/byProveedor`, {
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

  findById(id: string) {
    return this.http
      .get<Proveedor>(`${this.apiUrl}/byId`, {
        params: { id },
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
