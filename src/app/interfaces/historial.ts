export interface Historial {
  id:            number;
  usuarioModif:  string;
  campo:         Campo;
  modulo:        Modulo;
  identificador: string;
  fecha:         Date;
  nuevo:         string;
  anterior:      string;
  accion:        Accion;
}

export enum Accion {
  Actualizar = 'Actualizar',
  Eliminar = 'Eliminar',
  Ingreso = 'Ingreso',
}

export enum Campo {
  Abono = 'abono',
  Celular = 'celular',
  Descripcion = 'descripcion',
  EliminarCompra = 'Eliminar Compra',
  EliminarFacturaCompra = 'Eliminar Factura Compra',
  EliminarMovimiento = 'Eliminar Movimiento',
  Factura = 'factura',
  Fecha = 'fecha',
  Icono = 'icono',
  ImagenURL = 'imagenUrl',
  MarcaID = 'marca_id',
  Nombre = 'nombre',
  NuevaCaja = 'Nueva Caja',
  NuevaCategoria = 'Nueva Categoria',
  NuevaCompra = 'Nueva Compra',
  NuevaEmpresa = 'Nueva Empresa',
  NuevaFacturaCompra = 'Nueva Factura Compra',
  NuevaFacturaVenta = 'Nueva Factura Venta',
  NuevaFormaDePago = 'Nueva Forma de Pago',
  NuevaMarca = 'Nueva Marca',
  NuevaVenta = 'Nueva Venta',
  NuevoAbono = 'Nuevo Abono',
  NuevoCliente = 'Nuevo Cliente',
  NuevoImpuesto = 'Nuevo Impuesto',
  NuevoMenú = 'Nuevo Menú',
  NuevoMovimiento = 'Nuevo Movimiento',
  NuevoProducto = 'Nuevo Producto',
  NuevoProveedor = 'Nuevo Proveedor',
  NuevoRolUsuario = 'Nuevo RolUsuario',
  NuevoUsuario = 'Nuevo Usuario',
  NumFactura = 'numFactura',
  Prefijo = 'prefijo',
  Saldo = 'saldo',
  Telefono = 'telefono',
  Valor = 'valor',
}

export enum Modulo {
  AbonoFacturaVenta = 'Abono Factura Venta',
  Caja = 'Caja',
  Categoria = 'Categoria',
  Cliente = 'Cliente',
  Compra = 'Compra',
  Empresa = 'Empresa',
  FacturaCompra = 'Factura Compra',
  FacturaVenta = 'Factura Venta',
  FormaDePago = 'Forma de Pago',
  Impuesto = 'Impuesto',
  Marca = 'Marca',
  Menu = 'Menu',
  Movimiento = 'Movimiento',
  Producto = 'Producto',
  Proveedor = 'Proveedor',
  RolUsuario = 'RolUsuario',
  Usuario = 'Usuario',
  Venta = 'Venta',
}


