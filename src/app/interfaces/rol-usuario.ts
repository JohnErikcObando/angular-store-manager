import { Usuario } from './usuario';

export interface RolUsuario {
  id: number;
  nombre: string;
  fecha_now: Date;
  usuarioModif: string;
  usuario: Usuario;
  menu_rol: any[];
}

export interface CreateRolUsuarioDTO extends Omit<RolUsuario, 'id'> {}

export interface UpdateRolUsuarioDTO extends Partial<CreateRolUsuarioDTO> {}
