import { FacturaVenta } from './factura-venta';
import { Producto } from './producto';

export interface Venta {
  id: number;
  facturaVentaId: string;
  productoId: number;
  cantidad: number;
  valor: number;
  total: number;
  fechaNow: Date;
  usuarioModif: string;
  factura_venta: FacturaVenta;
  producto: Producto;
}

export interface CreateVentaDTO extends Omit<Venta, 'id'> {}

export interface UpdateVentaDTO extends Partial<CreateVentaDTO> {}
