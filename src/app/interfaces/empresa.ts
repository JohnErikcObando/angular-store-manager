import { FormGroup, FormControl } from '@angular/forms';

export type ControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Record<any, any> ? FormGroup<ControlsOf<T[K]>> : FormControl<T[K]>;
};

export interface Empresa {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  celular: string;
  logo: string;
  email: string;
  usuarioModif: string;
}

export interface CreateEmpresaDTO extends Omit<Empresa, 'id'> {}

export interface UpdateEmpresaDTO extends Partial<CreateEmpresaDTO> {}
