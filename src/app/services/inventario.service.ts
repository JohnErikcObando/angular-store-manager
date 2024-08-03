import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

// interfaces
import { Inventario } from 'app/interfaces';

import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private apiUrl = `${environment.apiUrl}/inventario`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Inventario[]>(this.apiUrl);
  }
}
