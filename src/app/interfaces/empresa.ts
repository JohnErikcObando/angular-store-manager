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
