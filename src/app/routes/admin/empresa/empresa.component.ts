import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { PageHeaderComponent } from '@shared';

// material
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

// interfaces
import { Empresa } from 'app/interfaces';

// servicios
import { EmpresaService } from 'app/services/empresa.service';
import { ValidatorsService } from '@shared/validators/servicios/validators.service';
import { Sweetalert2Service } from '@shared/services/sweetalert2.service';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [
    FormsModule,
    LayoutModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    PageHeaderComponent,
    ReactiveFormsModule,
  ],

  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.scss',
})
export class EmpresaComponent implements OnInit {
  errorMessage = signal('');

  // inject
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private empresaService = inject(EmpresaService);
  private sweetalert2Service = inject(Sweetalert2Service);

  empresa: Empresa[] = [];

  readonly form: FormGroup = this.fb.group({
    id: ['', Validators.required],
    nombre: ['', Validators.required],
    direccion: ['', Validators.required],
    telefono: ['', [Validators.maxLength(10), Validators.minLength(10)]],
    celular: ['', [Validators.maxLength(10), Validators.minLength(10)]],
    logo: [''],
    email: ['', [Validators.required, Validators.pattern(this.validatorsService.emailPattern)]],
    usuarioModif: ['MiMascota', Validators.required],
  });

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.form, field);
  }

  constructor() {}

  ngOnInit(): void {
    this.getAll();
    this.get('0000011');
  }

  save() {
    const data = this.form.value;

    this.empresaService.update(data.id, data).subscribe(rta => {
      this.sweetalert2Service.swalSuccess('La empresa se guardo correctamente');
      setTimeout(() => {
        // window.location.reload();
      }, 1500);
    });
  }

  private getAll() {
    this.empresaService.getAll().subscribe(data => {
      this.empresa = data;
      data.forEach(empresa => {
        this.get(empresa.id.toString());
      });
    });
  }

  private get(id: string) {
    this.empresaService.get(id).subscribe({
      next: data => {
        this.empresa = data;
        this.form.patchValue(data);
        console.log(this.empresa);
      },
      error: errorMsg => {
        window.alert(errorMsg);
      },
    });
  }
}
