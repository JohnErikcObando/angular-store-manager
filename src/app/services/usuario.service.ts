import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '@env/environment';

// interface
import { CreateUsuarioDTO, UpdateUsuarioDTO, Usuario } from 'app/interfaces';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/usuario`;

  constructor() {}

  create(dto: CreateUsuarioDTO) {
    return this.http.post<Usuario[]>(this.apiUrl, dto);
  }

  get(id: string) {
    return this.http.get<Usuario[]>(`${this.apiUrl}/${id}`);
  }

  getAll() {
    return this.http.get<Usuario[]>(`${this.apiUrl}`);
  }

  update(id: string, dto: UpdateUsuarioDTO) {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<Usuario>(`${this.apiUrl}/${id}`);
  }

  findByUsername(nombre: string) {
    return this.http
      .get<Usuario>(`${this.apiUrl}/byUsuario`, {
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

  validateUser(username: string, password: string) {
    return this.http
      .post<Usuario>(`${this.apiUrl}/login`, {
        params: { username, password },
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
