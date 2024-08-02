import { Component, inject, signal, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';

// material
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

// interfaces
import { Caja, Cliente, FacturaVenta, FormaPago, Producto } from 'app/interfaces';

// services
import {
  CajaService,
  ClienteService,
  FacturaVentaService,
  FormaPagoService,
  ProductoService,
} from 'app/services';
import { FormValidationService } from '../../../../../shared/services/formValidation.service';
import { map, Observable, startWith } from 'rxjs';
import { ValidatorsService } from '@shared/validators/servicios/validators.service';

// pipe
import { AjustarTextoPipe } from '@shared/pipes/ajustar-texto.pipe';
import { Sweetalert2Service } from '@shared/services/sweetalert2.service';

import { MyValidators } from 'app/utils';

const initialCliente: Cliente = {
  id: '',
  nombre: '',
  apellido: '',
  direccion: '',
  telefono: '',
  celular: '',
  email: '',
  usuarioModif: '',
};

@Component({
  selector: 'app-form-factura-ventas',
  standalone: true,
  imports: [
    AjustarTextoPipe,
    AsyncPipe,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDividerModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './form-factura-ventas.component.html',
  styleUrl: './form-factura-ventas.component.scss',
})
export class FormFacturaVentasComponent implements OnInit {
  cajas = signal<Caja[]>([]);
  formaPagos = signal<FormaPago[]>([]);
  productos = signal<Producto[]>([]);
  clientes = signal<Cliente[]>([]);
  cliente = signal<Cliente>(initialCliente);
  facturaVenta = signal<FacturaVenta[]>([]);
  addCliente = signal('Crear Cliente');
  ocultar = signal(false);
  estado = signal('Editar');

  filteredCliente!: Observable<Cliente[]>;
  filteredProducto!: Observable<Producto[]>;

  disableSelect = false;

  private fb = inject(FormBuilder);
  private cajaService = inject(CajaService);
  private formaPagoService = inject(FormaPagoService);
  private productoService = inject(ProductoService);
  private clienteService = inject(ClienteService);
  private facturaVentaService = inject(FacturaVentaService);
  private formValidationService = inject(FormValidationService);
  private sweetalert2Service = inject(Sweetalert2Service);
  private validatorsService = inject(ValidatorsService);

  readonly form: FormGroup = this.fb.group({
    cajaId: [{ value: 2, disabled: true }, Validators.required],
    formaPagoId: [1, Validators.required],
    fecha: [new Date(), Validators.required],
    valor: [0, Validators.required],
    descuento: [0, Validators.required],
    subtotal: [0, Validators.required],
    total: [0, Validators.required],
    abono: [0, Validators.required],
    saldo: [0, Validators.required],
    anulado: [false],
    descripcion: [''],
    usuarioModif: ['Mi Mascota'],
    nombreProducto: [''],
    nombreCliente: [''],
    clienteFactura: this.fb.group({
      id: [
        '',
        [Validators.required],
        MyValidators.ValidarExistente(this.clienteService, 'findById', 'id'),
      ],
      nombre: ['', Validators.required],
      apellido: [''],
      direccion: [''],
      telefono: ['', [Validators.maxLength(10), Validators.minLength(10)]],
      celular: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [this.validatorsService.validateEmail()]],
      usuarioModif: ['Mi Mascota'],
    }),
    detalleVenta: this.fb.array([]),
  });

  ngOnInit(): void {
    this.getAllCajas();
    this.getAllFormasPago();
    this.getAllCliente();
    this.getAllProductos();
    this.filterCliente();
    this.filterProducto();
    MyValidators.setEstado('Editar');
  }

  save() {
    console.log(
      'this.detalleVenta.length',
      this.detalleVenta.length,
      'this.form.valid',
      this.form.valid
    );

    if (this.form.valid && this.detalleVenta.length > 0) {
      console.log('ingreso a create');
      this.create();
    } else {
      this.sweetalert2Service.swalQuestion('Por favor ingresar todos los campos obligatorios');
    }

    this.form.get('idcaja')?.setValue(2);
    this.form.get('formaPagoId')?.setValue(1);
  }

  create() {
    this.camposEnable();

    const data = this.form.value;

    delete data.nombreProducto;
    delete data.nombreCliente;
    // Eliminar el campo 'producto' de cada objeto en el array 'detalleVenta'
    if (data.detalleVenta && Array.isArray(data.detalleVenta)) {
      data.detalleVenta.forEach((detalle: any) => {
        delete detalle.producto;
      });
    }

    this.facturaVentaService.create(data).subscribe(rta => {
      this.sweetalert2Service.swalSuccess('La factura se registro correctamente');
    });

    this.camposDisable();

    this.form.reset();
    this.detalleVenta.clear();
  }

  getAllCliente() {
    this.clienteService.getAll().subscribe(data => {
      this.clientes.set(data);
    });
  }

  getAllCajas() {
    this.cajaService.getAll().subscribe(data => {
      this.cajas.set(data);
    });
  }

  getAllFormasPago() {
    this.formaPagoService.getAll().subscribe(data => {
      this.formaPagos.set(data);
    });
  }

  getAllProductos() {
    this.productoService.getAll().subscribe(data => {
      this.productos.set(data);
    });
  }

  // -----------------------------------------------------------------
  // autocompletar Cliente
  // -----------------------------------------------------------------
  filterCliente() {
    this.filteredCliente = this.form.get('nombreCliente')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filtercliente(name as string) : this.clientes().slice();
      })
    );
  }

  displayFnCliente(cliente: Cliente): string {
    return cliente && cliente.nombre ? cliente.nombre : '';
  }

  private _filtercliente(nombre: string): Cliente[] {
    const filterValue = nombre.toLowerCase();

    return this.clientes().filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  onclienteSelected(event: Cliente): void {
    this.cliente.set(event);

    this.form.get('clienteFactura')?.patchValue(this.cliente());
  }

  // -----------------------------------------------------------------

  // -----------------------------------------------------------------
  // autocompletar Producto
  // -----------------------------------------------------------------
  filterProducto() {
    this.filteredProducto = this.form.get('nombreProducto')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterProducto(name as string) : this.productos().slice();
      })
    );
  }

  displayFnProducto(producto: Producto): string {
    return producto && producto.nombre ? producto.nombre : '';
  }

  private _filterProducto(nombre: string): Producto[] {
    const filterValue = nombre.toLowerCase();
    return this.productos().filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  onAddProducto(event: Producto): void {
    // Verificar si el producto ya existe en el FormArray
    const existingIndex = this.detalleVenta.controls.findIndex(
      detalle => detalle.get('productoId')?.value === event.id
    );

    if (existingIndex !== -1) {
      this.sweetalert2Service.swalQuestion(`El producto ya está agregado ${event.nombre}`);
      return;
    }

    // Crear un nuevo FormGroup para el detalle de compra
    const newDetalle = this.fb.group({
      productoId: [event.id, Validators.required],
      producto: [event.nombre, Validators.required],
      cantidad: [1, Validators.required],
      valor: [event.valor, Validators.required],
      total: [0, Validators.required],
      usuarioModif: ['MiMascota'],
    });

    // Inicializar el total para el nuevo FormGroup
    this.updateTotal(newDetalle);

    // Agregar el nuevo FormGroup al FormArray
    this.detalleVenta.push(newDetalle);

    // Actualizar la suma total después de agregar el nuevo FormGroup
    this.actualizarValorFactura();

    // Suscribirse a los cambios en cantidad y costo
    newDetalle.get('cantidad')?.valueChanges.subscribe(() => {
      this.updateTotal(newDetalle);
      this.actualizarValorFactura();
    });

    newDetalle.get('costo')?.valueChanges.subscribe(() => {
      this.updateTotal(newDetalle);
      this.actualizarValorFactura();
    });

    // Limpiar el campo de nombre del producto
    this.form.get('nombreProducto')?.setValue('');
  }

  get detalleVenta() {
    return this.form.get('detalleVenta') as FormArray;
  }

  removeCompra(i: number) {
    this.detalleVenta.removeAt(i);
    this.actualizarValorFactura();
  }

  updateTotal(detalle: FormGroup): void {
    const cantidad = detalle.get('cantidad')?.value || 0;
    const valor = detalle.get('valor')?.value || 0;
    const total = cantidad * valor;
    detalle.get('total')?.setValue(total, { emitEvent: false });
  }

  actualizarValorFactura(): void {
    let totalSum = 0;

    // Asegúrate de que 'this.detalleVenta' es del tipo FormArray
    (this.detalleVenta.controls as FormGroup[]).forEach((detalle: FormGroup) => {
      const total = detalle.get('total')?.value || 0;
      totalSum += total;
    });

    // Actualizar el campo 'valor' con la suma total
    this.form.get('valor')?.setValue(totalSum, { emitEvent: false });
    this.form.get('abono')?.setValue(totalSum, { emitEvent: false });
    this.form.get('total')?.setValue(totalSum);

    this.onactualizarAbono();
  }

  onactualizarValor() {
    this.actualizarValorFactura();
  }

  onactualizarAbono() {
    const totalFactura = 0;
    let saldo = this.form.get('saldo')?.value || 0;
    let abono = this.form.get('abono')?.value || 0;
    let total = this.form.get('valor')?.value || 0;
    let descuento = this.form.get('descuento')?.value || 0;

    console.log('saldo', saldo, 'abono', abono, 'total', total, 'descuento', descuento);

    if (descuento <= total && descuento > 0) {
      total = total - descuento;
      if (abono > total) {
        abono = total;
      }
    } else {
      descuento = 0;
    }

    console.log('total', total);

    if (abono > 0 && abono <= total) {
      saldo = total - abono;
    }

    this.form.get('saldo')?.setValue(saldo);
    this.form.get('total')?.setValue(total);
    this.form.get('abono')?.setValue(abono);
  }

  ocultarcliente() {
    this.ocultar.set(!this.ocultar());

    if (this.ocultar()) {
      this.addCliente.set('Buscar Cliente');
      MyValidators.setEstado('Guardar');
      this.clearClienteFactura();
    } else {
      this.addCliente.set('Crear Cliente');
      MyValidators.setEstado('Editar');
    }
    console.log('this.estado()', MyValidators.setEstado);
  }

  getErrorMessage(controlName: string): string {
    const control: AbstractControl | null = this.form.get(controlName);
    if (control) {
      return this.formValidationService.getErrorMessage(control);
    }
    return '';
  }

  clearClienteFactura() {
    const clienteFacturaGroup = this.form.get('clienteFactura') as FormGroup;

    // Restablece el grupo clienteFactura a sus valores iniciales
    clienteFacturaGroup.reset({
      id: '',
      nombre: '',
      apellido: '',
      direccion: '',
      telefono: '',
      celular: '',
      email: '',
      usuarioModif: 'Mi Mascota', // O el valor que quieras mantener por defecto
    });

    this.form.get('nombreCliente')?.setValue('');

    // Opcional: También puedes desmarcar los errores de validación si es necesario
    clienteFacturaGroup.markAsPristine();
    clienteFacturaGroup.markAsUntouched();
  }

  camposEnable() {
    this.form.get('cajaId')?.enable();
    // this.form.get('valor')?.enable();
    // // this.form.get('saldo')?.enable();
    // this.form.get('subtotal')?.enable();
  }

  camposDisable() {
    this.form.get('cajaId')?.disable();
    // this.form.get('valor')?.disable();
    // // this.form.get('saldo')?.disable();
    // this.form.get('subtotal')?.disable();
  }
}
