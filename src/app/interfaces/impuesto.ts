export interface Impuesto {
  id: number;
  nombre: string;
  porcentaje: number;
  ImpuestoModif: string;
}

export interface CreateImpuestoDTO extends Omit<Impuesto, 'id'> {}
export interface UpdateImpuestoDTO extends Partial<CreateImpuestoDTO> {}
