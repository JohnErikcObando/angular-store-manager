export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  usuarioModif: string;
}

export interface CreateCategoriaDTO extends Omit<Categoria, 'id'> {}

export interface UpdateCategoriaDTO extends Partial<CreateCategoriaDTO> {}
