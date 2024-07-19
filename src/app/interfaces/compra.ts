export interface Compra {
  id: number;
  facturaCompraId: string;
  productoId: number;
  cantidad: number;
  costo: number;
  venta: number;
  total: number;
  fechaNow: Date;
  usuarioModif: string;
}

export interface CreateCompraDTO extends Omit<Compra, 'id'> {}
export interface UpdateCompraDTO extends Partial<CreateCompraDTO> {}
