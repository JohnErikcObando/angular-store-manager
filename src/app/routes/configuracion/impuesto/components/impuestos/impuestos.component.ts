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
import { FormImpuestoComponent } from '../form-impuesto/form-impuesto.component';
import { Impuesto } from 'app/interfaces';
import { ImpuestoService } from 'app/services';

@Component({
  selector: 'app-impuestos',
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
  templateUrl: './impuestos.component.html',
  styleUrl: './impuestos.component.scss',
})
export class ImpuestosComponent implements OnInit {
  impuesto = signal<Impuesto[]>([]);

  displayedColumns: string[] = ['nombre', 'porcentaje', 'accion'];

  dataSource = new MatTableDataSource<Impuesto>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly estado = signal('');
  readonly formaPagoId = signal('');
  readonly dialog = inject(MatDialog);

  private impuestoService = inject(ImpuestoService);
  private sweetalert2Service = inject(Sweetalert2Service);

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.impuestoService.getAll().subscribe({
      next: data => {
        this.impuesto.set(data);
        this.dataSource = new MatTableDataSource<Impuesto>(data);
        this.dataSource.paginator = this.paginator;
      },
    });
  }

  create() {
    this.openDialog('Guardar', '');
  }

  edit(id: string) {
    this.openDialog('Editar', id);
  }

  delete(id: string) {
    this.sweetalert2Service.swalDelete('¿Desea eliminar el impuesto?').subscribe(confirmed => {
      if (confirmed) {
        this.impuestoService.delete(id).subscribe(() => {
          this.sweetalert2Service.swalSuccess('El impuesto se eliminó correctamente');

          this.getAll();
        });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(estado: string, id: string): void {
    const dialogRef = this.dialog.open(FormImpuestoComponent, {
      data: { estado, id },
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
