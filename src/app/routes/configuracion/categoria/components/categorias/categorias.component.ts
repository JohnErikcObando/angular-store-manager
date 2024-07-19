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
import { Categoria } from 'app/interfaces';
import { CategoriaService } from 'app/services/categoria.service';
import { Sweetalert2Service } from '@shared/services/sweetalert2.service';

import { PageHeaderComponent } from '@shared';
import { FormCategoriaComponent } from '../form-categoria/form-categoria.component';

@Component({
  selector: 'app-categorias',
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
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss',
})
export class CategoriasComponent implements OnInit {
  categoria = signal<Categoria[]>([]);

  displayedColumns: string[] = ['nombre', 'descripcion', 'accion'];

  dataSource = new MatTableDataSource<Categoria>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly estado = signal('');
  readonly idCatecoria = signal('');
  readonly dialog = inject(MatDialog);

  private categoriaService = inject(CategoriaService);
  private sweetalert2Service = inject(Sweetalert2Service);

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.categoriaService.getAll().subscribe({
      next: data => {
        this.categoria.set(data);
        this.dataSource = new MatTableDataSource<Categoria>(data);
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
        this.categoriaService.delete(id).subscribe(() => {
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
    const dialogRef = this.dialog.open(FormCategoriaComponent, {
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
