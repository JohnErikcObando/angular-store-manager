import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';

// Interfaces
import { CreateRolUsuarioDTO, RolUsuario, UpdateRolUsuarioDTO } from 'app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class RolUsuarioService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/rolUsuario`;

  constructor() {}

  create(dto: CreateRolUsuarioDTO) {
    return this.http.post<RolUsuario[]>(this.apiUrl, dto);
  }

  get(id: string) {
    return this.http.get<RolUsuario[]>(`${this.apiUrl}/${id}`);
  }

  getAll() {
    return this.http.get<RolUsuario[]>(`${this.apiUrl}`);
  }

  update(id: string, dto: UpdateRolUsuarioDTO) {
    return this.http.put<RolUsuario>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<RolUsuario>(`${this.apiUrl}/${id}`);
  }
}
