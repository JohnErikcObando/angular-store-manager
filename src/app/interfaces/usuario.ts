export interface Usuario {
  id:           number;
  rolUsuarioId: number;
  usuario:      string;
  password:     string;
  nombre:       string;
  apellido:     string;
  email:        string;
  activo:       boolean;
  fechaNow:     Date;
  usuarioModif: string;
}
