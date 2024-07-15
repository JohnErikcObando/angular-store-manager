export interface AbonoFactura {
  id:             number;
  facturaVentaId: string;
  formaPagoId:    number;
  fecha:          Date;
  valor:          number;
  fecha_now:      Date;
  descripcion:    string;
  anulado:        boolean;
  usuarioModif:   string;
}


