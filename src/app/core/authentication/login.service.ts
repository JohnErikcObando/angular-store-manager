import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, of } from 'rxjs';

import { admin, Menu } from '@core';
import { Token, User } from './interface';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  protected readonly http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}auth`;

  login(usuario: string, password: string, rememberMe = false) {
    console.log(' servicio login http');

    return this.http
      .post<any>(`${this.apiUrl}/login`, { usuario, password })
      .pipe(map(token => ({ access_token: token.accessToken, token_type: 'Bearer' })));
  }

  refresh(params: Record<string, any>) {
    return this.http.post<Token>(`${this.apiUrl}/token`, params);
    // return this.http.post<Token>('/auth/refresh', params);
  }

  logout() {
    // return this.http.post<any>(`${this.apiUrl}/logout`, {});

    return of({});
  }

  me() {
    // return this.http.get<User>('/me');
    return of(admin);
  }

  menu() {
    // return this.http.get<{ menu: Menu[] }>('/me/menu').pipe(map(res => res.menu));

    return this.http
      .get<{ menu: Menu[] }>('data/menu.json?_t=' + Date.now())
      .pipe(map(res => res.menu));
  }
}
