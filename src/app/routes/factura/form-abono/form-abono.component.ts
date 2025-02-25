import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';

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
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

// servicios
import { AbonosFacturaVentaService, FacturaVentaService, FormaPagoService } from 'app/services';
import { Sweetalert2Service } from '@shared/services/sweetalert2.service';

// interfaces
import { AbonosFacturaVenta, FormaPago } from 'app/interfaces';

// pipes
import { AjustarTextoPipe } from '@shared/pipes/ajustar-texto.pipe';

import { DialogData, FormValidationService } from '@shared';

@Component({
  selector: 'app-form-abono',
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
    MatTableModule,
    ReactiveFormsModule,
  ],
  templateUrl: './form-abono.component.html',
  styleUrl: './form-abono.component.scss',
})
export class FormAbonoComponent implements OnInit {
  private fb = inject(FormBuilder);

  private sweetalert2Service = inject(Sweetalert2Service);
  private abonosFacturaVentaService = inject(AbonosFacturaVentaService);
  private facturaVentaService = inject(FacturaVentaService);
  private formValidationService = inject(FormValidationService);
  private formaPagoService = inject(FormaPagoService);

  readonly dialogRef = inject(MatDialogRef<FormAbonoComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  displayedColumns: string[] = ['anulado', 'fecha', 'recibo', 'formaPago', 'descripcion', 'valor'];

  dataSource = new MatTableDataSource<AbonosFacturaVenta>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  abonos = signal<AbonosFacturaVenta[]>([]);
  formaPagos = signal<FormaPago[]>([]);

  botonAccion = signal('');
  bottonAccion = signal('Guardar');
  facturaId = signal('');
  saldo = signal<number>(0);

  readonly form: FormGroup = this.fb.group({
    facturaVentaId: ['', Validators.required],
    formaPagoId: [1, Validators.required],
    fecha: [new Date(), Validators.required],
    valor: [
      '',
      [
        Validators.required,
        Validators.min(0), // Asegura que el valor no sea menor a 0
        // Validators.max(0), // Asegura que el valor no sea mayor al saldo
      ],
    ],
    descripcion: [''],
    anulado: [false],
    usuarioModif: ['MiMascota'],
  });
  constructor() {}

  ngOnInit(): void {
    this.accion();
    this.getFormaPago();
    this.getAbonos();
  }

  save() {
    if (this.form.valid) {
      this.create();
    } else {
      this.sweetalert2Service.swalQuestion('Por favor ingresar todos los campos obligatorios');
    }
  }

  create() {
    const data = this.form.value;

    this.abonosFacturaVentaService.create(data).subscribe(rta => {
      this.sweetalert2Service.swalSuccess('El abono se registro Correctamente');
      this.dialogRef.close();
    });
  }

  update() {
    const data = this.form.value;

    // this.abonosFacturaVentaService.update(this.facturaId(), data).subscribe(rta => {
    //   this.sweetalert2Service.swalSuccess('El producto se edito Correctamente');
    //   this.dialogRef.close();
    // });
  }

  get(id: string) {
    // this.abonosFacturaVentaService.get(id).subscribe({
    //   next: user => {
    //     this.form.patchValue(user);
    //   },
    //   error: () => {
    //     this.abonos.set([]);
    //   },
    // });
  }

  accion() {
    this.botonAccion.set('Guardar');
    this.facturaId.set(this.data.id);
    this.form.get('facturaVentaId')?.setValue(this.facturaId());
  }

  getErrorMessage(controlName: string): string {
    const control: AbstractControl | null = this.form.get(controlName);
    if (control) {
      return this.formValidationService.getErrorMessage(control);
    }
    return '';
  }

  getFormaPago() {
    this.formaPagoService.getAll().subscribe(data => {
      this.formaPagos.set(data);
    });
  }

  getAbonos() {
    this.abonosFacturaVentaService.findByFactura(this.facturaId()).subscribe(data => {
      this.abonos.set(Array.isArray(data) ? data : [data]);

      if (!data || (Array.isArray(data) && data.length === 0)) {
        this.facturaVentaService.get(this.facturaId()).subscribe(data => {
          this.saldo.set(data.saldo);
        });
        return;
      }

      // Supongamos que `data` contiene `factura_venta` con el campo `saldo`
      const facturaVenta = Array.isArray(data) ? data[0].factura_venta : data.facturaVenta;
      if (facturaVenta) {
        this.saldo.set(facturaVenta.saldo); // Actualiza la señal con el saldo
      }

      this.dataSource = new MatTableDataSource<AbonosFacturaVenta>(this.abonos());
      this.dataSource.paginator = this.paginator;
    });
  }

  onactualizarValor() {
    const valor = this.form.get('valor')?.value;
    const saldo = this.saldo(); // Guarda el saldo en una variable para depuración

    if (saldo === 0) {
      this.sweetalert2Service.swalQuestion('La factura ya está cancelada');
      this.form.get('valor')?.setValue('');
      return; // Salir de la función si el saldo es 0
    }

    if (valor > saldo || valor <= 0) {
      this.sweetalert2Service.swalQuestion(
        'El valor no puede ser mayor al saldo o menor igual a 0'
      );
      this.form.get('valor')?.setValue('');
    }
  }
}
