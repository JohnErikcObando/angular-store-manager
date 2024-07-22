import { FormaPago } from './forma-pago';

export interface AbonosFacturaVenta {
  id: number;
  facturaVentaId: string;
  formaPagoId: number;
  fecha: Date;
  valor: number;
  fecha_now: Date;
  descripcion: string;
  anulado: boolean;
  usuarioModif: string;
  formaPago: FormaPago;
}

export interface CreateAbonosFacturaVentaDTO extends Omit<AbonosFacturaVenta, 'id'> {}

export interface UpdateAbonosFacturaVentaDTO extends Partial<CreateAbonosFacturaVentaDTO> {}
