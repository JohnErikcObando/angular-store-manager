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
