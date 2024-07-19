import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '@env/environment';

// interface
import { CreateClienteDTO, UpdateClienteDTO, Cliente } from 'app/interfaces';

import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/cliente`;

  constructor() {}

  create(dto: CreateClienteDTO) {
    return this.http.post<Cliente[]>(this.apiUrl, dto);
  }

  get(id: string) {
    return this.http.get<Cliente[]>(`${this.apiUrl}/${id}`);
  }

  getAll() {
    return this.http.get<Cliente[]>(`${this.apiUrl}`);
  }

  update(id: string, dto: UpdateClienteDTO) {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<Cliente>(`${this.apiUrl}/${id}`);
  }

  findById(id: string) {
    return this.http
      .get<Cliente>(`${this.apiUrl}/byId`, {
        params: { id: id },
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
