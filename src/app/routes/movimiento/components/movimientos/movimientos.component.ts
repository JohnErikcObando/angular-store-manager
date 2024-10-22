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
import { Movimiento } from 'app/interfaces';

// services
import { Sweetalert2Service } from '@shared/services/sweetalert2.service';
import { MovimientoService, ProveedorService } from 'app/services';

import { PageHeaderComponent } from '@shared';
import { FormMovimientoComponent } from '../form-movimiento/form-movimiento.component';

import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-movimientos',
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
  templateUrl: './movimientos.component.html',
  styleUrl: './movimientos.component.scss',
})
export class MovimientosComponent implements OnInit {
  movimietos = signal<Movimiento[]>([]);
  username = signal('');

  displayedColumns: string[] = ['fecha', 'tipo', 'descripcion', 'valor', 'factura', 'accion'];

  dataSource = new MatTableDataSource<Movimiento>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly estado = signal('');
  readonly movimientosId = signal('');
  readonly dialog = inject(MatDialog);

  private movimietosService = inject(MovimientoService);
  private sweetalert2Service = inject(Sweetalert2Service);

  ngOnInit(): void {
    this.username.set(localStorage.getItem('username') || 'MiMascota');
    this.getAll();
  }

  getAll() {
    this.movimietosService.getAll().subscribe({
      next: data => {
        this.movimietos.set(data);
        this.dataSource = new MatTableDataSource<Movimiento>(data);
        this.dataSource.paginator = this.paginator;
      },
    });
  }

  create() {
    this.openDialog('Guardar', '', this.username());
  }

  edit(id: string) {
    this.openDialog('Editar', id, this.username());
  }

  delete(id: string) {
    this.sweetalert2Service.swalDelete('¿Desea eliminar el movimiento?').subscribe(confirmed => {
      if (confirmed) {
        this.movimietosService.delete(id).subscribe(() => {
          this.sweetalert2Service.swalSuccess('El movimiento se eliminó correctamente');

          this.getAll();
        });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(estado: string, id: string, username: string): void {
    const dialogRef = this.dialog.open(FormMovimientoComponent, {
      data: { estado, id, username },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.estado.set(result);
      }
      this.getAll();
    });
  }
}
