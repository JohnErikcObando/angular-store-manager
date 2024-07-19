export interface FormaPago {
  id: number;
  nombre: string;
  usuarioModif: string;
}

export interface CreateFormaPagoDTO extends Omit<FormaPago, 'id'> {}
export interface UpdateFormaPagoDTO extends Partial<CreateFormaPagoDTO> {}
