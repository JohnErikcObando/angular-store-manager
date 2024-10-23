import { Component, inject, signal, ViewChild, OnInit } from '@angular/core';

import { animate, state, style, transition, trigger } from '@angular/animations';

// material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

// interfaces
import { Compra } from 'app/interfaces';

// services
import { FacturaCompraService } from 'app/services';

// pipes
import { CurrencyPipe, DatePipe } from '@angular/common';

import { PageHeaderComponent } from '@shared';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';

interface Factura {
  factura: string;
  fecha: string;
  caja: string;
  proveedor: string;
  formaPago: string;
  total: string;
  compra: Compra;
}

@Component({
  selector: 'app-factura-compras',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginator,
    MatProgressSpinnerModule,
    MatTableModule,
    PageHeaderComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './factura-compras.component.html',
  styleUrl: './factura-compras.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FacturaComprasComponent implements OnInit {
  facturaCompra = signal<Factura[]>([]);

  dataSource = new MatTableDataSource<Factura>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  startOfMonth = signal(new Date());
  endOfMonth = signal(new Date());

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(this.startOfMonth()),
    end: new FormControl<Date | null>(this.startOfMonth()),
  });

  columnsToDisplay: string[] = [
    'factura',
    'fecha',
    'caja',
    'proveedor',
    'formaPago',
    'total',
    'accion',
  ];

  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement!: Factura | null;

  readonly estado = signal('');
  readonly proveedorId = signal('');
  readonly dialog = inject(MatDialog);

  private facturaCompraService = inject(FacturaCompraService);

  ngOnInit(): void {
    this.startOfMonth.set(new Date()); // Primer día del mes
    this.endOfMonth.set(new Date()); // Último día del mes

    // Escuchar cambios en el formulario de rango de fechas
    this.range.valueChanges.subscribe(rangeValues => {
      const { start, end } = rangeValues;

      // Si ambas fechas están definidas, actualiza startOfMonth y endOfMonth
      if (start && end) {
        this.startOfMonth.set(start);
        this.endOfMonth.set(end);
      }
    });

    this.getAll();
  }

  getAll() {
    console.log('this.startOfMonth()', this.startOfMonth(), 'this.endOfMonth()', this.endOfMonth());

    this.facturaCompraService.getAll(this.startOfMonth(), this.endOfMonth()).subscribe({
      next: data => {
        const mappedData = data.map((item: any) => ({
          factura: item.id,
          fecha: item.fecha,
          caja: item.caja.nombre,
          proveedor: item.proveedor?.nombre,
          formaPago: item.forma_pago.nombre,
          total: item.valor,
          compra: item.compra, // Esto es para el detalle expandido
        }));

        this.facturaCompra.set(mappedData);
        console.log(this.facturaCompra());

        this.dataSource = new MatTableDataSource<Factura>(mappedData);
        this.dataSource.paginator = this.paginator;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
