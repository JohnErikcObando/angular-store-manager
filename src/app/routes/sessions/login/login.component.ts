import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

import { Sweetalert2Service } from '@shared/services/sweetalert2.service';
import { RequestStatus } from '../../../models/request-status.model';
import { AuthService } from '@core';
import { LocalStorageService } from '@shared';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MtxButtonModule,
    TranslateModule,
  ],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly store = inject(LocalStorageService);
  private readonly authService = inject(AuthService);
  private readonly sweetalert2Service = inject(Sweetalert2Service);

  isSubmitting = false;
  status = signal<RequestStatus>('init');

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  get username() {
    return this.loginForm.get('username')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe')!;
  }

  login() {
    if (this.loginForm.valid) {
      this.status.set('loading');
      const { username, password } = this.loginForm.getRawValue();
      this.authService.login(username, password).subscribe({
        next: data => {
          // Guardar el usuario en localStorage
          this.router.navigateByUrl('/dashboard');
        },
        error: (err: HttpErrorResponse) => {
          console.error('Login failed:', err);
          this.status.set('failed');
          this.sweetalert2Service.swalwarning('Usuario o Contraseña incorrecta');
        },
      });
    }
  }
}
