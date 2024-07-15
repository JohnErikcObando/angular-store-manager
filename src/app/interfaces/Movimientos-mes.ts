export interface MovimientoTipoMes {
  fecha: Date;
  mes: string;
  tipo: Tipo;
  valor: number;
}

export enum Tipo {
  Gasto = 'Gasto',
  Venta = 'Venta',
}
