export interface FacturaCompra {
  id: string;
  proveedorId: string;
  cajaId: number;
  formaPagoId: number;
  movimiento: null;
  fecha: Date;
  valor: number;
  descuento: number;
  subtotal: number;
  total: number;
  abono: number;
  saldo: number;
  anulado: boolean;
  fechaNow: Date;
  imagenUrl: string;
  descripcion: string;
  usuarioModif: string;
}

export interface CreateFacturaCompraDTO extends Omit<FacturaCompra, 'id'> {}
export interface UpdateFacturaCompraDTO extends Partial<CreateFacturaCompraDTO> {}
