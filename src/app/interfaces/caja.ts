export interface Caja {
  id: number;
  nombre: string;
  numFactura: number;
  prefijo: string;
  tipoFactura: string;
  usuarioModif: string;
}

export interface CreateCajaDTO extends Omit<Caja, 'id'> {}
export interface UpdateCajaDTO extends Partial<CreateCajaDTO> {}
