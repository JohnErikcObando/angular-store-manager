import { Component, inject, signal, OnInit } from '@angular/core';

// material
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
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
import { Caja, Compra, FacturaCompra, FormaPago, Producto, Proveedor } from 'app/interfaces';

// services
import {
  CajaService,
  FacturaCompraService,
  FormaPagoService,
  ProductoService,
  ProveedorService,
} from 'app/services';
import { FormValidationService } from '../../../../../shared/services/formValidation.service';
import { map, Observable, startWith } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';

// pipe
import { AjustarTextoPipe } from '@shared/pipes/ajustar-texto.pipe';
import { Sweetalert2Service } from '@shared/services/sweetalert2.service';

const initialProveedor: Proveedor = {
  id: '',
  nombre: '',
  telefono: '',
  celular: '',
  direccion: '',
  email: '',
  activo: false,
  usuarioModif: '',
};

@Component({
  selector: 'app-form-factura-compra',
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
  templateUrl: './form-factura-compra.component.html',
  styleUrl: './form-factura-compra.component.scss',
})
export class FormFacturaCompraComponent implements OnInit {
  cajas = signal<Caja[]>([]);
  formaPagos = signal<FormaPago[]>([]);
  productos = signal<Producto[]>([]);
  proveedores = signal<Proveedor[]>([]);
  proveedor = signal<Proveedor>(initialProveedor);
  facturaCompra = signal<FacturaCompra[]>([]);
  imagenUrl = signal('');
  ocultar = signal(false);

  filteredProveedor!: Observable<Proveedor[]>;
  filteredProducto!: Observable<Producto[]>;

  disableSelect = false;

  private fb = inject(FormBuilder);
  private cajaService = inject(CajaService);
  private formaPagoService = inject(FormaPagoService);
  private productoService = inject(ProductoService);
  private proveedorService = inject(ProveedorService);
  private facturaCompraService = inject(FacturaCompraService);
  private formValidationService = inject(FormValidationService);
  private sweetalert2Service = inject(Sweetalert2Service);

  readonly form: FormGroup = this.fb.group({
    cajaId: [{ value: 1, disabled: true }, Validators.required],
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
    imagenUrl: ['', Validators.required],
    usuarioModif: ['Mi Mascota'],
    nombreProducto: [''],
    nombreProveedor: ['', Validators.required],
    proveedorFactura: this.fb.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      telefono: ['', [Validators.maxLength(10), Validators.minLength(10)]],
      celular: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      direccion: [''],
      email: ['', [Validators.required, Validators.email]],
      activo: [true],
      usuarioModif: ['Mi Mascota'],
    }),
    detalleCompra: this.fb.array([]),
  });

  ngOnInit(): void {
    this.getAllCajas();
    this.getAllFormasPago();
    this.getAllProveedores();
    this.getAllProductos();
    this.filterProveedor();
    this.filterProducto();
  }

  save() {
    if (this.form.valid && this.detalleCompra.length > 0) {
      this.create();
    } else {
      this.sweetalert2Service.swalQuestion('Por favor ingresar todos los campos obligatorios');
    }
  }

  create() {
    this.form.get('cajaId')?.enable();

    const data = this.form.value;

    delete data.nombreProducto;
    delete data.nombreProveedor;
    // Eliminar el campo 'producto' de cada objeto en el array 'detalleCompra'
    if (data.detalleCompra && Array.isArray(data.detalleCompra)) {
      data.detalleCompra.forEach((detalle: any) => {
        delete detalle.producto;
      });
    }

    this.facturaCompraService.create(data).subscribe(rta => {
      this.sweetalert2Service.swalSuccess('La factura se registro correctamente');
    });

    this.form.get('cajaId')?.disable();

    this.imagenUrl.set('');
    this.form.reset();
    this.detalleCompra.clear();
  }

  getAllProveedores() {
    this.proveedorService.getAll().subscribe(data => {
      this.proveedores.set(data);
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

  getimg() {
    const url = this.form.get('imagenUrl')?.value;
    this.imagenUrl.set(url);
  }

  // -----------------------------------------------------------------
  // autocompletar Proveedor
  // -----------------------------------------------------------------
  filterProveedor() {
    this.filteredProveedor = this.form.get('nombreProveedor')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterProveedor(name as string) : this.proveedores().slice();
      })
    );
  }

  displayFnProveedor(proveedor: Proveedor): string {
    return proveedor && proveedor.nombre ? proveedor.nombre : '';
  }

  private _filterProveedor(nombre: string): Proveedor[] {
    const filterValue = nombre.toLowerCase();

    return this.proveedores().filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  onProveedorSelected(event: Proveedor): void {
    this.proveedor.set(event);

    this.form.get('proveedorFactura')?.patchValue(this.proveedor());
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
    const existingIndex = this.detalleCompra.controls.findIndex(
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
      costo: [event.costo, Validators.required],
      venta: [event.valor, Validators.required],
      total: [0, Validators.required],
      usuarioModif: ['MiMascota'],
    });

    // Inicializar el total para el nuevo FormGroup
    this.updateTotal(newDetalle);

    // Agregar el nuevo FormGroup al FormArray
    this.detalleCompra.push(newDetalle);

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

  get detalleCompra() {
    return this.form.get('detalleCompra') as FormArray;
  }

  removeCompra(i: number) {
    this.detalleCompra.removeAt(i);
    this.actualizarValorFactura();
  }

  updateTotal(detalle: FormGroup): void {
    const cantidad = detalle.get('cantidad')?.value || 0;
    const costo = detalle.get('costo')?.value || 0;
    const total = cantidad * costo;
    detalle.get('total')?.setValue(total, { emitEvent: false });
  }

  actualizarValorFactura(): void {
    let totalSum = 0;

    // Asegúrate de que 'this.detalleCompra' es del tipo FormArray
    (this.detalleCompra.controls as FormGroup[]).forEach((detalle: FormGroup) => {
      const total = detalle.get('total')?.value || 0;
      totalSum += total;
    });

    this.form.patchValue({
      valor: totalSum,
      abono: totalSum,
      total: totalSum,
    });

    this.onactualizarValor();
  }

  onactualizarValor() {
    const totalFactura = 0;
    let saldo = this.form.get('saldo')?.value || 0;
    let abono = this.form.get('abono')?.value || 0;
    let total = this.form.get('valor')?.value || 0;
    let descuento = this.form.get('descuento')?.value || 0;

    if (descuento <= total && descuento > 0) {
      total = total - descuento;
      if (abono > total) {
        abono = total;
      }
    } else {
      descuento = 0;
    }

    if (abono > 0 && abono <= total) {
      saldo = total - abono;
    }

    this.form.patchValue({
      saldo,
      total,
      abono,
      descuento,
      subtotal: 0,
      fecha: new Date(),
      cajaId: 1,
      formaPagoId: 1,
      usuarioModif: 'Mi Mascota',
      anulado: false,
      descripcion: '',
    });
  }

  getErrorMessage(controlName: string): string {
    const control: AbstractControl | null = this.form.get(controlName);
    if (control) {
      return this.formValidationService.getErrorMessage(control);
    }
    return '';
  }
}
