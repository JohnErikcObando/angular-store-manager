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
import { Caja } from 'app/interfaces';
import { CajaService } from 'app/services';
import { Sweetalert2Service } from '@shared/services/sweetalert2.service';

import { PageHeaderComponent } from '@shared';
import { FormCajaComponent } from '../form-caja/form-caja.component';

@Component({
  selector: 'app-caja',
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
  templateUrl: './caja.component.html',
  styleUrl: './caja.component.scss',
})
export class CajaComponent implements OnInit {
  caja = signal<Caja[]>([]);

  displayedColumns: string[] = ['nombre', 'numFactura', 'prefijo', 'tipoDocumento', 'accion'];

  dataSource = new MatTableDataSource<Caja>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly estado = signal('');
  readonly cajaId = signal('');
  readonly dialog = inject(MatDialog);

  private cajaService = inject(CajaService);
  private sweetalert2Service = inject(Sweetalert2Service);

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.cajaService.getAll().subscribe({
      next: data => {
        this.caja.set(data);
        this.dataSource = new MatTableDataSource<Caja>(data);
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
    this.sweetalert2Service.swalDelete('¿Desea eliminar la categoria?').subscribe(confirmed => {
      if (confirmed) {
        this.cajaService.delete(id).subscribe(() => {
          this.sweetalert2Service.swalSuccess('La categoria se eliminó correctamente');

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
    const dialogRef = this.dialog.open(FormCajaComponent, {
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
