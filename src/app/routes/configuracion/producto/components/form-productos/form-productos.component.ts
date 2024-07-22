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
import { CategoriaService, MarcaService, ProductoService } from 'app/services';
import { Categoria, Marca, Producto } from 'app/interfaces';

// pipes
import { AjustarTextoPipe } from '@shared/pipes/ajustar-texto.pipe';
import { MyValidators } from 'app/utils';

@Component({
  selector: 'app-form-productos',
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
  templateUrl: './form-productos.component.html',
  styleUrl: './form-productos.component.scss',
})
export class FormProductosComponent implements OnInit {
  private fb = inject(FormBuilder);

  private sweetalert2Service = inject(Sweetalert2Service);
  private productoService = inject(ProductoService);
  private validatorsService = inject(ValidatorsService);
  private formValidationService = inject(FormValidationService);
  private marcaService = inject(MarcaService);
  private categoriaService = inject(CategoriaService);

  readonly dialogRef = inject(MatDialogRef<FormProductosComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  producto = signal<Producto[]>([]);
  marca = signal<Marca[]>([]);
  categoria = signal<Categoria[]>([]);

  botonAccion = signal('');
  bottonAccion = signal('Guardar');
  productoId = signal('');

  readonly form: FormGroup = this.fb.group({
    nombre: [
      '',
      [Validators.required],
      MyValidators.ValidarCampoExistente(
        this.productoService,
        'findByProducto',
        'nombre',
        this.data.estado
      ),
    ],
    marcaId: ['', [Validators.required]],
    categoriaId: ['', [Validators.required]],
    codigo: [''],
    descripcion: [''],
    valor: ['', [Validators.required]],
    usuarioModif: ['MiMascota'],
  });
  constructor() {}

  ngOnInit(): void {
    this.accion();
    this.getMarca();
    this.getCategoria();
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

    this.productoService.create(data).subscribe(rta => {
      this.sweetalert2Service.swalSuccess('El usuario se registro Correctamente');
      this.dialogRef.close();
    });
  }

  update() {
    const data = this.form.value;

    this.productoService.update(this.productoId(), data).subscribe(rta => {
      this.sweetalert2Service.swalSuccess('El usuario se edito Correctamente');
      this.dialogRef.close();
    });
  }

  get(Id: string) {
    this.productoService.get(Id).subscribe({
      next: user => {
        this.form.patchValue(user);
      },
      error: () => {
        this.producto.set([]);
      },
    });
  }

  accion() {
    if (this.data.id != '') {
      this.botonAccion.set('Editar');
      this.productoId.set(this.data.id);
      console.log('editar', this.productoId());

      this.get(this.productoId());
    } else {
      console.log(this.data);
      this.botonAccion.set('Guardar');
      this.productoId.set('');
    }
  }

  getErrorMessage(controlName: string): string {
    const control: AbstractControl | null = this.form.get(controlName);
    if (control) {
      return this.formValidationService.getErrorMessage(control);
    }
    return '';
  }

  getMarca() {
    this.marcaService.getAll().subscribe(data => {
      this.marca.set(data);
    });
  }

  getCategoria() {
    this.categoriaService.getAll().subscribe(data => {
      this.categoria.set(data);
    });
  }
}
