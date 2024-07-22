import { Categoria } from './categoria';
import { Marca } from './marca';

export interface Producto {
  id: number;
  marcaId: number;
  categoriaId: number;
  nombre: string;
  codigo: string;
  descripcion: string;
  valor: number;
  fechaNow?: Date;
  imagenUrl: string;
  usuarioModif: string;
  marca: Marca;
  categoria: Categoria;
}

export interface CreateProductoDTO extends Omit<Producto, 'id'> {}

export interface UpdateProductoDTO extends Partial<CreateProductoDTO> {}
