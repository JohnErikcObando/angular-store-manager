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
import { Cliente } from 'app/interfaces';

// services
import { Sweetalert2Service } from '@shared/services/sweetalert2.service';
import { ClienteService } from 'app/services/cliente.service';

import { PageHeaderComponent } from '@shared';
import { FormClienteComponent } from '../form-cliente/form-cliente.component';

@Component({
  selector: 'app-clientes',
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
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss',
})
export class ClientesComponent implements OnInit {
  usuario = signal<Cliente[]>([]);
  username = signal('');

  displayedColumns: string[] = ['nombre', 'telefono', 'celular', 'direccion', 'email', 'accion'];

  dataSource = new MatTableDataSource<Cliente>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly estado = signal('');
  readonly categoriaId = signal('');
  readonly dialog = inject(MatDialog);

  private clienteService = inject(ClienteService);
  private sweetalert2Service = inject(Sweetalert2Service);

  ngOnInit(): void {
    this.username.set(localStorage.getItem('username') || 'MiMascota');
    this.getAll();
  }

  getAll() {
    this.clienteService.getAll().subscribe({
      next: data => {
        this.usuario.set(data);
        this.dataSource = new MatTableDataSource<Cliente>(data);
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
    this.sweetalert2Service.swalDelete('¿Desea eliminar el cliente?').subscribe(confirmed => {
      if (confirmed) {
        this.clienteService.delete(id).subscribe(() => {
          this.sweetalert2Service.swalSuccess('El cliente se eliminó correctamente');

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
    const dialogRef = this.dialog.open(FormClienteComponent, {
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
