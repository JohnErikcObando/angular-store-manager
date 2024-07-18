import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '@env/environment';

// interface
import { CreateUsuarioDTO, UpdateUsuarioDTO, Usuario } from 'app/interfaces';

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
}
