import { Component, inject, OnInit, signal } from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

// material
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

// servicios
import { Sweetalert2Service } from '@shared/services/sweetalert2.service';

import { ValidatorsService } from '@shared/validators/servicios/validators.service';

// interfaces
import { DialogData, FormValidationService } from '@shared';
import { ProveedorService } from 'app/services';
import { Proveedor } from 'app/interfaces';

// pipes
import { AjustarTextoPipe } from '@shared/pipes/ajustar-texto.pipe';
import { MyValidators } from 'app/utils';

@Component({
  selector: 'app-form-proveedores',
  standalone: true,
  imports: [
    AjustarTextoPipe,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './form-proveedores.component.html',
  styleUrl: './form-proveedores.component.scss',
})
export class FormProveedoresComponent implements OnInit {
  private fb = inject(FormBuilder);

  private sweetalert2Service = inject(Sweetalert2Service);
  private proveedorService = inject(ProveedorService);
  private validatorsService = inject(ValidatorsService);
  private formValidationService = inject(FormValidationService);

  readonly dialogRef = inject(MatDialogRef<FormProveedoresComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  proveedor = signal<Proveedor[]>([]);

  botonAccion = signal('');
  bottonAccion = signal('Guardar');
  proveedorId = signal('');

  readonly form: FormGroup = this.fb.group({
    id: [
      '',
      [Validators.required],
      MyValidators.ValidarCampoExistente(this.proveedorService, 'findById', 'id', this.data.estado),
    ],
    nombre: [
      '',
      [Validators.required],
      MyValidators.ValidarCampoExistente(
        this.proveedorService,
        'findByProveedor',
        'nombre',
        this.data.estado
      ),
    ],
    telefono: ['', [Validators.maxLength(10), Validators.minLength(10)]],
    celular: ['', [Validators.minLength(10), Validators.maxLength(10)]],
    direccion: [''],
    email: ['', [Validators.email, this.validatorsService.validateEmail()]],
    activo: ['', [Validators.required]],
    usuarioModif: ['MiMascota'],
  });
  constructor() {}

  ngOnInit(): void {
    this.accion();
  }

  save() {
    if (this.form.valid) {
      if (this.botonAccion() === 'Guardar') {
        this.create();
      } else {
        this.update();
      }
    } else {
      this.sweetalert2Service.swalQuestion('Por favor ingresar todos los campos obligatorios');
    }
  }

  create() {
    const data = this.form.value;
    data.usuarioModif = this.data.username;

    this.proveedorService.create(data).subscribe(rta => {
      this.sweetalert2Service.swalSuccess('El proveedor se registro Correctamente');
      this.dialogRef.close();
    });
  }

  update() {
    const data = this.form.value;
    data.usuarioModif = this.data.username;

    this.proveedorService.update(this.proveedorId(), data).subscribe(rta => {
      this.sweetalert2Service.swalSuccess('El proveedor se edito Correctamente');
      this.dialogRef.close();
    });
  }

  get(clienteId: string) {
    this.proveedorService.get(clienteId).subscribe({
      next: user => {
        this.form.patchValue(user);
      },
      error: () => {
        this.proveedor.set([]);
      },
    });
  }

  accion() {
    if (this.data.id != '') {
      this.botonAccion.set('Editar');
      this.proveedorId.set(this.data.id);
      this.get(this.proveedorId());
    } else {
      this.botonAccion.set('Guardar');
      this.proveedorId.set('');
    }
  }

  getErrorMessage(controlName: string): string {
    const control: AbstractControl | null = this.form.get(controlName);
    if (control) {
      return this.formValidationService.getErrorMessage(control);
    }
    return '';
  }
}
