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

// servicios
import { Sweetalert2Service } from '@shared/services/sweetalert2.service';
import { MarcaService } from 'app/services';

// interfaces
import { Marca } from 'app/interfaces';

// pipes
import { AjustarTextoPipe } from '@shared/pipes/ajustar-texto.pipe';

import { DialogData, FormValidationService } from '@shared';
import { ValidatorCampoExistente } from '@shared/validators/validators/validatorCampoExistente';
import { MyValidators } from 'app/utils';

@Component({
  selector: 'app-form-marca',
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
  templateUrl: './form-marca.component.html',
  styleUrl: './form-marca.component.scss',
})
export class FormMarcaComponent implements OnInit {
  private fb = inject(FormBuilder);

  private sweetalert2Service = inject(Sweetalert2Service);
  private marcaService = inject(MarcaService);
  private formValidationService = inject(FormValidationService);

  readonly dialogRef = inject(MatDialogRef<FormMarcaComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  marca = signal<Marca[]>([]);
  botonAccion = signal('');
  bottonAccion = signal('Guardar');
  marcaId = signal('');
  hide = signal(true);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  readonly form: FormGroup = this.fb.group({
    nombre: [
      '',
      [Validators.required],
      MyValidators.ValidarCampoExistente(this.marcaService, 'findByMarca', 'id', this.data.estado),
    ],
    descripcion: ['', [Validators.maxLength(500)]],
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

    this.marcaService.create(data).subscribe(rta => {
      this.sweetalert2Service.swalSuccess('La marca se registro Correctamente');
      this.dialogRef.close();
    });
  }

  update() {
    const data = this.form.value;

    this.marcaService.update(this.marcaId(), data).subscribe(rta => {
      this.sweetalert2Service.swalSuccess('La marca se edito Correctamente');
      this.dialogRef.close();
    });
  }

  get(categoriaId: string) {
    this.marcaService.get(categoriaId).subscribe({
      next: user => {
        this.form.patchValue(user);
      },
      error: () => {
        this.marca.set([]);
      },
    });
  }

  accion() {
    if (this.data.id != '') {
      this.botonAccion.set('Editar');
      this.marcaId.set(this.data.id);
     this.get(this.marcaId());
    } else {
      this.botonAccion.set('Guardar');
      this.marcaId.set('');
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
