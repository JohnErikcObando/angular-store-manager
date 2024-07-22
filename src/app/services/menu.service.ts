import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { retry } from 'rxjs';
import { Menu } from 'app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private apiUrl = `${environment.apiUrl}/menu`;

  constructor(private http: HttpClient) {}

  getListaMenu() {
    console.log('apiUrl', this.apiUrl);

    return this.http.get<Menu[]>(this.apiUrl).pipe(retry(3));
  }
}
