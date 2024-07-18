import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  inject,
  model,
  signal,
} from '@angular/core';

import { PageHeaderComponent } from '@shared';

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

import { FormUsuarioComponent } from '../form-usuario/form-usuario.component';

// interfaces
import { Usuario } from 'app/interfaces';

// services
import { Sweetalert2Service } from '@shared/services/sweetalert2.service';
import { UsuarioService } from 'app/services';

@Component({
  selector: 'app-usuarios',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
})
export class UsuariosComponent implements OnInit {
  // usuario: Usuario[] = [];

  usuario = signal<Usuario[]>([]);

  displayedColumns: string[] = ['usuario', 'nombreCompleto', 'email', 'activo', 'accion'];

  dataSource = new MatTableDataSource<Usuario>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly estado = signal('');
  readonly idUsuario = model('');
  readonly dialog = inject(MatDialog);

  private usuarioService = inject(UsuarioService);
  private sweetalert2Service = inject(Sweetalert2Service);

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.usuarioService.getAll().subscribe({
      next: data => {
        this.usuario.set(data);
        this.dataSource = new MatTableDataSource<Usuario>(data);
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
    this.sweetalert2Service.swalDelete('¿Desea eliminar el usuario?').subscribe(confirmed => {
      if (confirmed) {
        this.usuarioService.delete(id).subscribe(() => {
          this.sweetalert2Service.swalSuccess('El usuario se eliminó correctamente');

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
    const dialogRef = this.dialog.open(FormUsuarioComponent, {
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
