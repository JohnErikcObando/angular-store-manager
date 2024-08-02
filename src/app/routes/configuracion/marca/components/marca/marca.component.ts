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
import { Marca } from 'app/interfaces';
import { MarcaService } from 'app/services';
import { Sweetalert2Service } from '@shared/services/sweetalert2.service';

import { PageHeaderComponent } from '@shared';
import { FormMarcaComponent } from '../form-marca/form-marca.component';

@Component({
  selector: 'app-marca',
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
  templateUrl: './marca.component.html',
  styleUrl: './marca.component.scss',
})
export class MarcaComponent implements OnInit {
  marca = signal<Marca[]>([]);

  displayedColumns: string[] = ['nombre', 'descripcion', 'accion'];

  dataSource = new MatTableDataSource<Marca>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly estado = signal('');
  readonly marcaId = signal('');
  readonly dialog = inject(MatDialog);

  private marcaService = inject(MarcaService);
  private sweetalert2Service = inject(Sweetalert2Service);

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.marcaService.getAll().subscribe({
      next: data => {
        this.marca.set(data);
        this.dataSource = new MatTableDataSource<Marca>(data);
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
    this.sweetalert2Service.swalDelete('¿Desea eliminar la marca?').subscribe(confirmed => {
      if (confirmed) {
        this.marcaService.delete(id).subscribe(() => {
          this.sweetalert2Service.swalSuccess('La marca se eliminó correctamente');

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
    const dialogRef = this.dialog.open(FormMarcaComponent, {
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
