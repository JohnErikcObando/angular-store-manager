import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '@env/environment';

// interface
import { CreateUsuarioDTO, UpdateUsuarioDTO, Usuario } from 'app/interfaces';
import { catchError, throwError } from 'rxjs';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuarioService = inject(UsuarioService);

  login(username: string, password: string, rememberMe: boolean) {
    return this.usuarioService.validateUser(username, password);
    console.log(this.usuarioService.validateUser(username, password));
  }
}
