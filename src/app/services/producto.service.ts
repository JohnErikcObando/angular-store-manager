import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

// interfaces
import { CreateProductoDTO, Producto, UpdateProductoDTO } from 'app/interfaces';

import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private apiUrl = `${environment.apiUrl}/producto`;

  constructor(private http: HttpClient) {}

  create(dto: CreateProductoDTO) {
    return this.http.post<Producto>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateProductoDTO) {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, dto);
  }

  patch(id: string, dto: UpdateProductoDTO) {
    return this.http.patch<Producto>(`${this.apiUrl}/${id}/usuariomodif`, dto);
  }

  delete(id: string) {
    return this.http.delete<Producto>(`${this.apiUrl}/${id}`);
  }

  getAll() {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  get(id: string) {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`).pipe(
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

  findByProducto(nombre: string) {
    return this.http
      .get<Producto>(`${this.apiUrl}/byProducto`, {
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
