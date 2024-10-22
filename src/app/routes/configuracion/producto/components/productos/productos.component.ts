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
import { Categoria, Marca, Producto } from 'app/interfaces';

// services
import { Sweetalert2Service } from '@shared/services/sweetalert2.service';
import { CategoriaService, ProductoService } from 'app/services';

import { PageHeaderComponent } from '@shared';
import { FormProductosComponent } from './../form-productos/form-productos.component';
import { MarcaService } from '../../../../../services/marca.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-productos',
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
    CurrencyPipe,
  ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss',
})
export class ProductosComponent implements OnInit {
  productos = signal<Producto[]>([]);
  marca = signal<Marca[]>([]);
  categoria = signal<Categoria[]>([]);
  username = signal('');

  displayedColumns: string[] = [
    'nombre',
    'marca',
    'categoria',
    'codigo',
    'descripcion',
    'valor',
    'costo',
    'accion',
  ];

  dataSource = new MatTableDataSource<Producto>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly estado = signal('');
  readonly productoId = signal('');
  readonly dialog = inject(MatDialog);

  private productoService = inject(ProductoService);
  private sweetalert2Service = inject(Sweetalert2Service);

  ngOnInit(): void {
    this.username.set(localStorage.getItem('username') || 'MiMascota');
    this.getAll();
  }

  getAll() {
    this.productoService.getAll().subscribe({
      next: data => {
        this.productos.set(data);
        this.dataSource = new MatTableDataSource<Producto>(data);
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
    this.sweetalert2Service.swalDelete('¿Desea eliminar el producto?').subscribe(confirmed => {
      if (confirmed) {
        this.productoService.delete(id).subscribe(() => {
          this.sweetalert2Service.swalSuccess('El producto se eliminó correctamente');
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
    const dialogRef = this.dialog.open(FormProductosComponent, {
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
