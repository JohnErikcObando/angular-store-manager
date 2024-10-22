import { HttpClient, HttpErrorResponse, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';

// interfaces
import { Caja, CreateCajaDTO, UpdateCajaDTO } from 'app/interfaces';

import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CajaService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/caja`;

  constructor() {}

  private getHeaders() {
    // Obtén el objeto de token desde localStorage y parsea el JSON
    const storedToken = localStorage.getItem('token'); // 'token' es la clave donde se guarda
    const storedTokenu = localStorage.getItem('username'); // 'token' es la clave donde se guarda

    if (storedToken) {
      const parsedToken = JSON.parse(storedToken); // Parsear el JSON
      const accessToken = parsedToken.access_token; // Obtener solo el access_token

      return new HttpHeaders({
        Authorization: `${parsedToken.token_type} ${accessToken}`, // Usar token_type y access_token
      });
    } else {
      // Manejo si no existe el token en localStorage
      throw new Error('Token no encontrado en localStorage');
    }
  }

  create(dto: CreateCajaDTO) {
    return this.http.post<Caja>(this.apiUrl, dto, { headers: this.getHeaders() });
  }

  update(id: string, dto: UpdateCajaDTO) {
    return this.http.put<Caja>(`${this.apiUrl}/${id}`, dto);
  }

  patch(id: string, usuarioModif: string) {
    console.log('usuarioModif', usuarioModif);

    return this.http.patch<Caja>(`${this.apiUrl}/${id}/usuariomodif`, { usuarioModif });
  }

  delete(id: string) {
    return this.http.delete<Caja>(`${this.apiUrl}/${id}`);
  }

  getAll() {
    return this.http.get<Caja[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  get(id: string) {
    return this.http.get<Caja>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
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
