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
import { ClienteService } from 'app/services';
import { Cliente } from 'app/interfaces';

// pipes
import { AjustarTextoPipe } from '@shared/pipes/ajustar-texto.pipe';
import { MyValidators } from 'app/utils';

@Component({
  selector: 'app-form-cliente',
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
  templateUrl: './form-cliente.component.html',
  styleUrl: './form-cliente.component.scss',
})
export class FormClienteComponent implements OnInit {
  private fb = inject(FormBuilder);

  private sweetalert2Service = inject(Sweetalert2Service);
  private clienteService = inject(ClienteService);
  private validatorsService = inject(ValidatorsService);
  private formValidationService = inject(FormValidationService);

  readonly dialogRef = inject(MatDialogRef<FormClienteComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  cliente = signal<Cliente[]>([]);

  botonAccion = signal('');
  bottonAccion = signal('Guardar');
  clienteId = signal('');

  readonly form: FormGroup = this.fb.group({
    id: [
      '',
      [Validators.required],
      MyValidators.ValidarCampoExistente(this.clienteService, 'findById', 'id', this.data.estado),
    ],
    nombre: ['', [Validators.required]],
    apellido: [''],
    telefono: ['', [Validators.maxLength(10), Validators.minLength(10)]],
    celular: ['', [Validators.minLength(10), Validators.maxLength(10)]],
    direccion: [''],
    email: ['', [Validators.email, this.validatorsService.validateEmail()]],
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

    this.clienteService.create(data).subscribe(rta => {
      this.sweetalert2Service.swalSuccess('El cliente se registro Correctamente');
      this.dialogRef.close();
    });
  }

  update() {
    const data = this.form.value;

    data.usuarioModif = this.data.username;

    this.clienteService.update(this.clienteId(), data).subscribe(rta => {
      this.sweetalert2Service.swalSuccess('El cliente se edito Correctamente');
      this.dialogRef.close();
    });
  }

  get(clienteId: string) {
    this.clienteService.get(clienteId).subscribe({
      next: user => {
        this.form.patchValue(user);
      },
      error: () => {
        this.cliente.set([]);
      },
    });
  }

  accion() {
    if (this.data.id != '') {
      this.botonAccion.set('Editar');
      this.clienteId.set(this.data.id);
      this.get(this.clienteId());
    } else {
      this.botonAccion.set('Guardar');
      this.clienteId.set('');
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
