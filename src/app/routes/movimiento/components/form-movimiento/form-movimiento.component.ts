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
import { MatDatepickerModule } from '@angular/material/datepicker';
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
import { Movimiento } from 'app/interfaces';
import { MovimientoService } from 'app/services';

// pipes
import { AjustarTextoPipe } from '@shared/pipes/ajustar-texto.pipe';

@Component({
  selector: 'app-form-movimiento',
  standalone: true,
  imports: [
    AjustarTextoPipe,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
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
  templateUrl: './form-movimiento.component.html',
  styleUrl: './form-movimiento.component.scss',
})
export class FormMovimientoComponent implements OnInit {
  private fb = inject(FormBuilder);

  private sweetalert2Service = inject(Sweetalert2Service);
  private movimientoService = inject(MovimientoService);
  private validatorsService = inject(ValidatorsService);
  private formValidationService = inject(FormValidationService);

  readonly dialogRef = inject(MatDialogRef<FormMovimientoComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  movimiento = signal<Movimiento[]>([]);

  botonAccion = signal('');
  bottonAccion = signal('Guardar');
  moviminetoId = signal('');

  readonly form: FormGroup = this.fb.group({
    fecha: [new Date(), Validators.required],
    tipo: ['', [Validators.required]],
    descripcion: [''],
    valor: ['', [Validators.required]],
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

    this.movimientoService.create(data).subscribe(rta => {
      this.sweetalert2Service.swalSuccess('El movimiento se registro Correctamente');
      this.dialogRef.close();
    });
  }

  update() {
    const data = this.form.value;

    this.movimientoService.update(this.moviminetoId(), data).subscribe(rta => {
      this.sweetalert2Service.swalSuccess('El movimiento se edito Correctamente');
      this.dialogRef.close();
    });
  }

  get(clienteId: string) {
    this.movimientoService.get(clienteId).subscribe({
      next: user => {
        this.form.patchValue(user);
      },
      error: () => {
        this.movimiento.set([]);
      },
    });
  }

  accion() {
    if (this.data.id != '') {
      this.botonAccion.set('Editar');
      this.moviminetoId.set(this.data.id);
      console.log('editar', this.moviminetoId());

      this.get(this.moviminetoId());
    } else {
      console.log(this.data);
      this.botonAccion.set('Guardar');
      this.moviminetoId.set('');
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
