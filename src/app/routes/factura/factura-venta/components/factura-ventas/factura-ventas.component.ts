import { Component, inject, signal, ViewChild, OnInit } from '@angular/core';

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
import { Cliente, FacturaVenta, Venta } from 'app/interfaces';

// services
import { Sweetalert2Service } from '@shared/services/sweetalert2.service';
import { FacturaVentaService } from 'app/services';

// pipes
import { CurrencyPipe, DatePipe } from '@angular/common';

import { PageHeaderComponent } from '@shared';

@Component({
  selector: 'app-factura-ventas',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginator,
    MatProgressSpinnerModule,
    MatTableModule,
    PageHeaderComponent,
    MatCardModule,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './factura-ventas.component.html',
  styleUrl: './factura-ventas.component.scss',
})
export class FacturaVentasComponent implements OnInit {
  facturaVenta = signal<FacturaVenta[]>([]);
  venta = signal<Venta[]>([]);

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

  dataSource = new MatTableDataSource<FacturaVenta>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly estado = signal('');
  readonly proveedorId = signal('');
  readonly dialog = inject(MatDialog);

  private facturaVentaService = inject(FacturaVentaService);
  private sweetalert2Service = inject(Sweetalert2Service);

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.facturaVentaService.getAll().subscribe({
      next: data => {
        this.facturaVenta.set(data);
        console.log(this.facturaVenta());

        this.dataSource = new MatTableDataSource<FacturaVenta>(data);
        this.dataSource.paginator = this.paginator;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
