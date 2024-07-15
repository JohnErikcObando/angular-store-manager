import { Tipo } from './tipo-movimiento';

export interface Movimiento {
  id: number;
  fecha: Date;
  tipo: string;
  descripcion: string;
  valor: number;
  factura: string;
  fechaNow: Date;
  usuarioModif: string;
}

export interface CreateMovimientoDTO extends Omit<Movimiento, 'id'> {}
export interface UpdateMovimientoDTO extends Partial<CreateMovimientoDTO> {}
