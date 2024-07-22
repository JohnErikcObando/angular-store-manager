import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// material
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
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
import { FormaPagoService } from 'app/services';

// interfaces
import { FormaPago } from 'app/interfaces';

// pipes
import { AjustarTextoPipe } from '@shared/pipes/ajustar-texto.pipe';

import { DialogData, FormValidationService } from '@shared';
import { MyValidators } from 'app/utils';

@Component({
  selector: 'app-form-forma-pagos',
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
    ReactiveFormsModule,
  ],
  templateUrl: './form-forma-pagos.component.html',
  styleUrl: './form-forma-pagos.component.scss',
})
export class FormFormaPagosComponent implements OnInit {
  private fb = inject(FormBuilder);

  private sweetalert2Service = inject(Sweetalert2Service);
  private formaPagoService = inject(FormaPagoService);
  private formValidationService = inject(FormValidationService);

  readonly dialogRef = inject(MatDialogRef<FormFormaPagosComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  formaPago = signal<FormaPago[]>([]);
  botonAccion = signal('');
  bottonAccion = signal('Guardar');
  formaPagoId = signal('');

  readonly form: FormGroup = this.fb.group({
    nombre: [
      '',
      [Validators.required],
      MyValidators.ValidarCampoExistente(
        this.formaPagoService,
        'findByFormaPago',
        'nombre',
        this.data.estado
      ),
    ],
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

    this.formaPagoService.create(data).subscribe(rta => {
      this.sweetalert2Service.swalSuccess('La forma de Pago se registro Correctamente');
      this.dialogRef.close();
    });
  }

  update() {
    const data = this.form.value;

    this.formaPagoService.update(this.formaPagoId(), data).subscribe(rta => {
      this.sweetalert2Service.swalSuccess('La forma de Pago se edito Correctamente');
      this.dialogRef.close();
    });
  }

  get(formaPagoId: string) {
    this.formaPagoService.get(formaPagoId).subscribe({
      next: user => {
        this.form.patchValue(user);
      },
      error: () => {
        this.formaPago.set([]);
      },
    });
  }

  accion() {
    if (this.data.id != '') {
      this.botonAccion.set('Editar');
      this.formaPagoId.set(this.data.id);
      console.log('editar', this.formaPagoId());

      this.get(this.formaPagoId());
    } else {
      console.log(this.data);
      this.botonAccion.set('Guardar');
      this.formaPagoId.set('');
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
