export interface Proveedor {
  id: string;
  nombre: string;
  telefono: string;
  celular: string;
  direccion: string;
  email: string;
  activo: boolean;
  usuarioModif: string;
}

export interface CreateProveedorDTO extends Omit<Proveedor, 'id'> {}

export interface UpdateProveedorDTO extends Partial<CreateProveedorDTO> {}
