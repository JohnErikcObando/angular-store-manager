import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';

import { environment } from '@env/environment';

// interface
import { Categoria, CreateCategoriaDTO, UpdateCategoriaDTO } from 'app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/categoria`;

  constructor() {}

  create(dto: CreateCategoriaDTO) {
    return this.http.post<Categoria[]>(this.apiUrl, dto);
  }

  get(id: string) {
    return this.http.get<Categoria[]>(`${this.apiUrl}/${id}`);
  }

  getAll() {
    return this.http.get<Categoria[]>(`${this.apiUrl}`);
  }

  update(id: string, dto: UpdateCategoriaDTO) {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<Categoria>(`${this.apiUrl}/${id}`);
  }

  findByCategoria(nombre: string): Observable<{ isAvailable: boolean }> {
    return this.http
      .get<Categoria>(`${this.apiUrl}/byCategoria`, {
        params: { nombre },
      })
      .pipe(
        map(() => ({ isAvailable: false })), // Si se encuentra la categoría, no está disponible
        catchError((error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.NotFound) {
            // Si no se encuentra la categoría, está disponible
            return of({ isAvailable: true });
          }
          // Otros errores pueden manejarse según sea necesario
          return throwError(() => new Error('Error en la solicitud'));
        })
      );
  }
}
