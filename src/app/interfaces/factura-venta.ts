import { DetalleVenta } from './detalle-venta';
import { Venta } from './venta';
export interface FacturaVenta {
  id: string;
  clienteId: string;
  cajaId: number;
  formaPagoId: number;
  movimientoId: null;
  fecha: Date;
  valor: number;
  descuento: number;
  subtotal: number;
  total: number;
  abono: number;
  saldo: number;
  anulado: boolean;
  fechaNow: Date;
  descripcion: string;
  usuarioModif: string;
  detalleVenta: Venta;
}

export interface CreateFacturaVentaDTO extends Omit<FacturaVenta, 'id'> {}
export interface UpdateFacturaVentaDTO extends Partial<CreateFacturaVentaDTO> {}
