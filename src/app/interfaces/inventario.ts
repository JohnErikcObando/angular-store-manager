export interface Inventario {
  id: number;
  marcaId: number;
  categoriaId: number;
  nombre: string;
  codigo: string;
  descripcion: string;
  valor: number;
  costo: number;
  fechaNow: Date;
  imagenUrl: string;
  usuarioModif: string;
  inventario?: InventarioElement[];
}

export interface InventarioElement {
  id: number;
  productoId: number;
  entrada: number;
  salida: number;
  saldo: number;
}
