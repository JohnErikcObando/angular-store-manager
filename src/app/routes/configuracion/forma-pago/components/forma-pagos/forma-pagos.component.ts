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

// servicios

import { Sweetalert2Service } from '@shared/services/sweetalert2.service';

import { PageHeaderComponent } from '@shared';
import { FormFormaPagosComponent } from '../form-forma-pagos/form-forma-pagos.component';
import { FormaPago } from 'app/interfaces';
import { FormaPagoService } from 'app/services';

@Component({
  selector: 'app-forma-pagos',
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
    PageHeaderComponent,
  ],
  templateUrl: './forma-pagos.component.html',
  styleUrl: './forma-pagos.component.scss',
})
export class FormaPagosComponent implements OnInit {
  formaPago = signal<FormaPago[]>([]);
  username = signal('');

  displayedColumns: string[] = ['nombre', 'accion'];

  dataSource = new MatTableDataSource<FormaPago>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly estado = signal('');
  readonly formaPagoId = signal('');
  readonly dialog = inject(MatDialog);

  private formaPagoService = inject(FormaPagoService);
  private sweetalert2Service = inject(Sweetalert2Service);

  ngOnInit(): void {
    this.username.set(localStorage.getItem('username') || 'MiMascota');
    this.getAll();
  }

  getAll() {
    this.formaPagoService.getAll().subscribe({
      next: data => {
        this.formaPago.set(data);
        this.dataSource = new MatTableDataSource<FormaPago>(data);
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

  delete(id: number) {
    this.sweetalert2Service.swalDelete('¿Desea eliminar la forma de pago?').subscribe(confirmed => {
      if (confirmed) {
        this.formaPagoService.delete(id).subscribe(() => {
          this.sweetalert2Service.swalSuccess('La forma de pago se eliminó correctamente');

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
    const dialogRef = this.dialog.open(FormFormaPagosComponent, {
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
