import { AbonosFacturaVenta } from './abono-factura-venta';
import { Caja } from './caja';
import { Cliente } from './cliente';
import { FormaPago } from './forma-pago';

export interface Venta {
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
  fechaNow?: Date;
  descripcion: string;
  usuarioModif: string;
  caja?: Caja;
  cliente?: Cliente;
  abonoFacturaCV?: AbonosFacturaVenta[];
  forma_pago?: FormaPago;
}
