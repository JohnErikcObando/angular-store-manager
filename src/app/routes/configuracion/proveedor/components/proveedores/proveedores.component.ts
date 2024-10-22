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
import { Cliente, Proveedor } from 'app/interfaces';

// services
import { Sweetalert2Service } from '@shared/services/sweetalert2.service';
import { ProveedorService } from 'app/services';

import { PageHeaderComponent } from '@shared';
import { FormProveedoresComponent } from './../form-proveedores/form-proveedores.component';

@Component({
  selector: 'app-proveedores',
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
  ],
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.scss',
})
export class ProveedoresComponent implements OnInit {
  proveedor = signal<Proveedor[]>([]);
  username = signal('');

  displayedColumns: string[] = ['nombre', 'telefono', 'celular', 'direccion', 'email', 'accion'];

  dataSource = new MatTableDataSource<Proveedor>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly estado = signal('');
  readonly proveedorId = signal('');
  readonly dialog = inject(MatDialog);

  private proveedorService = inject(ProveedorService);
  private sweetalert2Service = inject(Sweetalert2Service);

  ngOnInit(): void {
    this.username.set(localStorage.getItem('username') || 'MiMascota');
    this.getAll();
  }

  getAll() {
    this.proveedorService.getAll().subscribe({
      next: data => {
        this.proveedor.set(data);
        this.dataSource = new MatTableDataSource<Proveedor>(data);
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
    this.sweetalert2Service.swalDelete('¿Desea eliminar el proveedor?').subscribe(confirmed => {
      if (confirmed) {
        this.proveedorService.delete(id).subscribe(() => {
          this.sweetalert2Service.swalSuccess('El proveedor se eliminó correctamente');

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
    const dialogRef = this.dialog.open(FormProveedoresComponent, {
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
