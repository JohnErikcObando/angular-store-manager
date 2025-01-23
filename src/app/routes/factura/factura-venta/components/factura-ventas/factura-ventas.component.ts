import { Component, inject, signal, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

// material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

// interfaces
import { FacturaVenta, ReporteFacturaVenta, Venta } from 'app/interfaces';

// services
import { FacturaVentaService } from 'app/services';

// pipes
import { CurrencyPipe, DatePipe, JsonPipe } from '@angular/common';

// components
import { DetalleVentasComponent } from '../detalle-ventas/detalle-ventas.component';
import { FormAbonoComponent } from 'app/routes/factura/form-abono/form-abono.component';
import { PageHeaderComponent } from '@shared';
import { map } from 'rxjs';
import { Cliente } from '../../../../../interfaces/cliente';

@Component({
  selector: 'app-factura-ventas',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatPaginator,
    MatProgressSpinnerModule,
    MatTableModule,
    PageHeaderComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './factura-ventas.component.html',
  styleUrl: './factura-ventas.component.scss',
})
export class FacturaVentasComponent implements OnInit {
  facturaVenta = signal<ReporteFacturaVenta[]>([]);
  venta = signal<Venta[]>([]);
  startOfMonth = signal(new Date());
  endOfMonth = signal(new Date());

  displayedColumns: string[] = [
    'factura',
    'fecha',
    'caja',
    'cliente',
    'formaPago',
    'total',
    'abono',
    'saldo',
    'accion',
  ];

  dataSource = new MatTableDataSource<ReporteFacturaVenta>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly estado = signal('Guardar');
  readonly proveedorId = signal('');

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(this.startOfMonth()),
    end: new FormControl<Date | null>(this.startOfMonth()),
  });

  private facturaVentaService = inject(FacturaVentaService);
  readonly dialog = inject(MatDialog);

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

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
    this.facturaVentaService.getAll(this.startOfMonth(), this.endOfMonth()).subscribe({
      next: data => {
        const mappedData = data.map((item: any) => ({
          factura: item.id,
          fecha: item.fecha,
          caja: item.caja.nombre,
          cliente: item.cliente.nombre,
          formaPago: item.forma_pago.nombre,
          total: item.valor,
          abono: item.abono,
          saldo: item.saldo,
        }));

        console.log(mappedData);

        this.facturaVenta.set(mappedData);
        this.dataSource = new MatTableDataSource<ReporteFacturaVenta>(mappedData);
        this.dataSource.paginator = this.paginator;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(id: string): void {
    const dialogRef = this.dialog.open(FormAbonoComponent, {
      data: { id },
      disableClose: true,
      width: '70vw', // Ajusta el ancho del diálogo
      height: '90vh', // Ajusta el alto del diálogo
      maxWidth: '70vw', // Máximo ancho del diálogo
      maxHeight: '90vh', // Máximo alto del diálogo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.estado.set(result);
      }
      this.getAll();
    });
  }

  openDialogDetalle(id: string): void {
    console.log(id);

    const dialogRef = this.dialog.open(DetalleVentasComponent, {
      data: { id },
      disableClose: true,
      width: '70vw', // Ajusta el ancho del diálogo
      height: '53vh', // Ajusta el alto del diálogo
      maxWidth: '70vw', // Máximo ancho del diálogo
      maxHeight: '53vh', // Máximo alto del diálogo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.estado.set(result);
      }
      this.getAll();
    });
  }
}
