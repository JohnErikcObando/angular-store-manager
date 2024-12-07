import { Producto } from './producto';

export interface DetalleVenta {
  id: number;
  facturaVentaId: string;
  productoId: number;
  cantidad: number;
  valor: number;
  total: number;
  fechaNow?: Date;
  usuarioModif: string;
  producto: Producto;
}

export interface Ventas {
  nombre: string;
  cantidad: number;
  costo: number;
  total: number;
}
