import { Component } from '@angular/core';

import { PageHeaderComponent } from '@shared';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [PageHeaderComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
})
export class UsuariosComponent {}
