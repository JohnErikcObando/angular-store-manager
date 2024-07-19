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
import { RolUsuarioService, UsuarioService } from 'app/services';
import { ValidatorsService } from '@shared/validators/servicios/validators.service';

// interfaces
import { DialogData, FormValidationService } from '@shared';
import { RolUsuario, Usuario } from 'app/interfaces';

import { AjustarTextoPipe } from '@shared/pipes/ajustar-texto.pipe';

@Component({
  selector: 'app-form-usuario',
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
  templateUrl: './form-usuario.component.html',
  styleUrl: './form-usuario.component.scss',
})
export class FormUsuarioComponent implements OnInit {
  private fb = inject(FormBuilder);

  private sweetalert2Service = inject(Sweetalert2Service);
  private usuarioService = inject(UsuarioService);
  private validatorsService = inject(ValidatorsService);
  private formValidationService = inject(FormValidationService);
  private rolUsuarioService = inject(RolUsuarioService);

  readonly dialogRef = inject(MatDialogRef<FormUsuarioComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  usuario = signal<Usuario[]>([]);
  rolUsuarios = signal<RolUsuario[]>([]);
  botonAccion = signal('');
  bottonAccion = signal('Guardar');
  usuarioId = signal('');
  hide = signal(true);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  readonly form: FormGroup = this.fb.group({
    activo: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email, this.validatorsService.validateEmail()]],
    nombre: ['', Validators.required],
    password: ['', Validators.required],
    rolUsuarioId: ['', Validators.required],
    usuario: ['', [Validators.required, Validators.minLength(4)]],
    usuarioModif: ['MiMascota', Validators.required],
  });
  constructor() {}

  ngOnInit(): void {
    this.getAllRolUsuario();
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

    this.usuarioService.create(data).subscribe(rta => {
      this.sweetalert2Service.swalSuccess('El usuario se registro Correctamente');
      this.dialogRef.close();
    });
  }

  update() {
    const data = this.form.value;

    this.usuarioService.update(this.usuarioId(), data).subscribe(rta => {
      this.sweetalert2Service.swalSuccess('El usuario se edito Correctamente');
      this.dialogRef.close();
    });
  }

  get(usuarioId: string) {
    this.usuarioService.get(usuarioId).subscribe({
      next: user => {
        this.form.patchValue(user);
      },
      error: () => {
        this.usuario.set([]);
      },
    });
  }

  getAllRolUsuario() {
    this.rolUsuarioService.getAll().subscribe(data => {
      this.rolUsuarios.set(data);
    });
  }

  accion() {
    if (this.data.id != '') {
      this.botonAccion.set('Editar');
      this.usuarioId.set(this.data.id);
      console.log('editar', this.usuarioId());

      this.get(this.usuarioId());
    } else {
      console.log(this.data);
      this.botonAccion.set('Guardar');
      this.usuarioId.set('');
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
