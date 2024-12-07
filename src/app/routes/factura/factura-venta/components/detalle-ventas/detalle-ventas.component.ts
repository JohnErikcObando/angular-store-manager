import { map } from 'rxjs/operators';
import { Component, inject, signal, ViewChild, OnInit } from '@angular/core';

// material
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

// interfaces
import { DetalleVenta, Venta, Ventas } from 'app/interfaces';

// services
import { VentaService } from 'app/services';

// shared
import { DialogData } from '@shared';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-detalle-ventas',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginator,
    MatProgressSpinnerModule,
    MatTableModule,
    MatDialogClose,
    CurrencyPipe,
  ],
  templateUrl: './detalle-ventas.component.html',
  styleUrl: './detalle-ventas.component.scss',
})
export class DetalleVentasComponent {
  detalleVenta = signal<Ventas[]>([]);
  username = signal('');

  displayedColumns: string[] = ['producto', 'cantidad', 'costo', 'total'];

  dataSource = new MatTableDataSource<Ventas>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private ventaService = inject(VentaService);

  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.ventaService.findByDetalle(this.data.id).subscribe({
      next: data => {
        const mappedData = data.map((detalle: DetalleVenta) => ({
          nombre: detalle.producto.nombre,
          cantidad: detalle.cantidad,
          costo: detalle.producto.costo,
          total: detalle.total,
        }));

        this.detalleVenta.set(mappedData);

        this.dataSource = new MatTableDataSource<Ventas>(mappedData);
        this.dataSource.paginator = this.paginator;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getTotalCost() {
    return this.detalleVenta().reduce((acc, venta) => acc + venta.total, 0);
  }
}
