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
import { ImpuestoService } from 'app/services';

// interfaces
import { Impuesto } from 'app/interfaces';

// pipes
import { AjustarTextoPipe } from '@shared/pipes/ajustar-texto.pipe';

import { DialogData, FormValidationService } from '@shared';
import { MyValidators } from 'app/utils';
import { ImpuestosComponent } from '../impuestos/impuestos.component';

@Component({
  selector: 'app-form-impuesto',
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
  templateUrl: './form-impuesto.component.html',
  styleUrl: './form-impuesto.component.scss',
})
export class FormImpuestoComponent implements OnInit {
  private fb = inject(FormBuilder);

  private sweetalert2Service = inject(Sweetalert2Service);
  private impuestoService = inject(ImpuestoService);
  private formValidationService = inject(FormValidationService);

  readonly dialogRef = inject(MatDialogRef<ImpuestosComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  formaPago = signal<Impuesto[]>([]);
  botonAccion = signal('');
  bottonAccion = signal('Guardar');
  impuestoId = signal('');

  readonly form: FormGroup = this.fb.group({
    nombre: [
      '',
      [Validators.required],
      MyValidators.ValidarCampoExistente(
        this.impuestoService,
        'findByImpuesto',
        'nombre',
        this.data.estado
      ),
    ],
    porcentaje: ['', Validators.required],
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

    this.impuestoService.create(data).subscribe(rta => {
      this.sweetalert2Service.swalSuccess('El impuesto se registro Correctamente');
      this.dialogRef.close();
    });
  }

  update() {
    const data = this.form.value;
    data.usuarioModif = this.data.username;

    this.impuestoService.update(this.impuestoId(), data).subscribe(rta => {
      this.sweetalert2Service.swalSuccess('El impuesto se edito Correctamente');
      this.dialogRef.close();
    });
  }

  get(impuestoId: string) {
    this.impuestoService.get(impuestoId).subscribe({
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
      this.impuestoId.set(this.data.id);
      this.get(this.impuestoId());
    } else {
      this.botonAccion.set('Guardar');
      this.impuestoId.set('');
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
