import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';


import { environment } from '@env/environment';

import { CreateEmpresaDTO, Empresa, UpdateEmpresaDTO } from 'app/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  private http = inject(HttpClient);

  #empresa = signal<Empresa>({
    id: '',
    nombre: '',
    direccion: '',
    telefono: '',
    celular: '',
    logo: '',
    email: '',
    usuarioModif: '',
  });

  public id = computed(() => this.#empresa().id);
  public nombre = computed(() => this.#empresa().nombre);
  public direccion = computed(() => this.#empresa().direccion);
  public telefono = computed(() => this.#empresa().telefono);
  public celular = computed(() => this.#empresa().celular);
  public logo = computed(() => this.#empresa().logo);
  public email = computed(() => this.#empresa().email);
  public usuarioModif = computed(() => this.#empresa().usuarioModif);

  private apiUrl = `${environment.apiUrl}/empresa`;

  constructor() {}

  create(dto: CreateEmpresaDTO) {
    return this.http.post<Empresa[]>(this.apiUrl, dto);
  }

  get(id: string) {
    return this.http.get<Empresa[]>(`${this.apiUrl}/${id}`);
  }

  getAll() {
    return this.http.get<Empresa[]>(`${this.apiUrl}`);
  }

  update(id: string, dto: UpdateEmpresaDTO) {
    return this.http.put<Empresa>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<Empresa>(`${this.apiUrl}/${id}`);
  }
}
