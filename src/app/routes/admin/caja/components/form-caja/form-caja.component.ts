import { Component, Inject, inject, model, OnInit, signal } from '@angular/core';
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
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

// servicios
import { Sweetalert2Service } from '@shared/services/sweetalert2.service';
import { CajaService } from 'app/services';

// interfaces
import { Caja } from 'app/interfaces';

// pipes
import { AjustarTextoPipe } from '@shared/pipes/ajustar-texto.pipe';

import { DialogData, FormValidationService } from '@shared';

import { MyValidators } from 'app/utils';

@Component({
  selector: 'app-form-caja',
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
    MatSelectModule,
  ],
  templateUrl: './form-caja.component.html',
  styleUrl: './form-caja.component.scss',
})
export class FormCajaComponent implements OnInit {
  private fb = inject(FormBuilder);

  private sweetalert2Service = inject(Sweetalert2Service);
  private cajaService = inject(CajaService);
  private formValidationService = inject(FormValidationService);

  readonly dialogRef = inject(MatDialogRef<FormCajaComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  caja = signal<Caja[]>([]);
  botonAccion = signal('');
  bottonAccion = signal('Guardar');
  cajaId = signal('');

  readonly form: FormGroup = this.fb.group({
    nombre: [
      '',
      [Validators.required, Validators.minLength(4)],
      MyValidators.ValidarCampoExistente(
        this.cajaService,
        'findByCaja',
        'nombre',
        this.data.estado
      ),
    ],
    numFactura: ['0', [Validators.required]],
    prefijo: ['', [Validators.required, Validators.maxLength(2)]],
    tipoFactura: ['', [Validators.required]],
    usuarioModif: [''],
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

    this.cajaService.create(data).subscribe(rta => {
      this.sweetalert2Service.swalSuccess('La caja se registro Correctamente');
      this.dialogRef.close();
    });
  }

  update() {
    const data = this.form.value;

    data.usuarioModif = this.data.username;

    console.log('data caja', data);

    this.cajaService.update(this.cajaId(), data).subscribe(rta => {
      this.sweetalert2Service.swalSuccess('La caja se edito Correctamente');
      this.dialogRef.close();
    });
  }

  get(categoriaId: string) {
    this.cajaService.get(categoriaId).subscribe({
      next: user => {
        this.form.patchValue(user);
      },
      error: () => {
        this.caja.set([]);
      },
    });
  }

  accion() {
    if (this.data.id != '') {
      this.botonAccion.set('Editar');
      this.cajaId.set(this.data.id);

      this.get(this.cajaId());
    } else {
      this.botonAccion.set('Guardar');
      this.cajaId.set('');
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
