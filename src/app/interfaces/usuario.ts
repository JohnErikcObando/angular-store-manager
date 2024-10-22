import { RolUsuario } from './rol-usuario';
export interface Usuario {
  id: number;
  rolUsuarioId: number;
  usuario: string;
  password: string;
  nombre: string;
  apellido: string;
  email: string;
  activo: boolean;
  fechaNow: Date;
  usuarioModif: string;
  rol_usuario: RolUsuario;
}

export interface CreateUsuarioDTO extends Omit<Usuario, 'id'> {}

export interface UpdateUsuarioDTO extends Partial<CreateUsuarioDTO> {}
