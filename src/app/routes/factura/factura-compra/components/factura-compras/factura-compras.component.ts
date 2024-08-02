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
import { Cliente, FacturaCompra, Proveedor } from 'app/interfaces';

// services
import { Sweetalert2Service } from '@shared/services/sweetalert2.service';
import { FacturaCompraService } from 'app/services';

// pipes
import { CurrencyPipe, DatePipe } from '@angular/common';

import { PageHeaderComponent } from '@shared';

@Component({
  selector: 'app-factura-compras',
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
  templateUrl: './factura-compras.component.html',
  styleUrl: './factura-compras.component.scss',
})
export class FacturaComprasComponent implements OnInit {
  facturaCompra = signal<FacturaCompra[]>([]);

  displayedColumns: string[] = [
    'factura',
    'fecha',
    'caja',
    'proveedor',
    'formaPago',
    'total',
    'accion',
  ];

  dataSource = new MatTableDataSource<FacturaCompra>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly estado = signal('');
  readonly proveedorId = signal('');
  readonly dialog = inject(MatDialog);

  private facturaCompraService = inject(FacturaCompraService);
  private sweetalert2Service = inject(Sweetalert2Service);

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.facturaCompraService.getAll().subscribe({
      next: data => {
        this.facturaCompra.set(data);
        console.log(this.facturaCompra());

        this.dataSource = new MatTableDataSource<FacturaCompra>(data);
        this.dataSource.paginator = this.paginator;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
