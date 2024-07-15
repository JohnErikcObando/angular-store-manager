import { User } from './interface';

export const admin: User = {
  id: 1,
  name: 'Mi Mascota',
  email: 'distri.mimascota@gmail.com',
  avatar: 'images/mimascota.ico',
};

export const guest: User = {
  name: 'unknown',
  email: 'unknown',
  avatar: 'images/avatar-default.jpg',
};
