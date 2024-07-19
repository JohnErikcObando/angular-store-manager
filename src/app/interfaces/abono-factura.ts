export interface AbonoFactura {
  id: number;
  facturaVentaId: string;
  formaPagoId: number;
  fecha: Date;
  valor: number;
  fecha_now: Date;
  descripcion: string;
  anulado: boolean;
  usuarioModif: string;
}

export interface CreateAbonoFacturaDTO extends Omit<AbonoFactura, 'id'> {}

export interface UpdateAbonoFacturaDTO extends Partial<CreateAbonoFacturaDTO> {}
