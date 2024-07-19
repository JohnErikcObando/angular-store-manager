export interface Marca {
  id: number;
  nombre: string;
  descripcion: string;
  usuarioModif: string;
}

export interface CreateMarcaDTO extends Omit<Marca, 'id'> {}
export interface UpdateMarcaDTO extends Partial<CreateMarcaDTO> {}
