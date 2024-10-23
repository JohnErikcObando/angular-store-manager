import { Component, inject, signal, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

// material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
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
import { MovimientoService } from 'app/services';

import { PageHeaderComponent } from '@shared';
import { FormMovimientoComponent } from '../form-movimiento/form-movimiento.component';

import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginator,
    MatProgressSpinnerModule,
    MatTableModule,
    PageHeaderComponent,
    ReactiveFormsModule,
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

  startOfMonth = signal(new Date());
  endOfMonth = signal(new Date());

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(this.startOfMonth()),
    end: new FormControl<Date | null>(this.startOfMonth()),
  });

  readonly estado = signal('');
  readonly movimientosId = signal('');
  readonly dialog = inject(MatDialog);

  private movimietosService = inject(MovimientoService);
  private sweetalert2Service = inject(Sweetalert2Service);



  ngOnInit(): void {
    this.startOfMonth.set(new Date()); // Primer día del mes
    this.endOfMonth.set(new Date()); // Último día del mes

    // Escuchar cambios en el formulario de rango de fechas
    this.range.valueChanges.subscribe(rangeValues => {
      const { start, end } = rangeValues;

      // Si ambas fechas están definidas, actualiza startOfMonth y endOfMonth
      if (start && end) {
        this.startOfMonth.set(start);
        this.endOfMonth.set(end);
      }
    });

    this.username.set(localStorage.getItem('username') || 'MiMascota');
    this.getAll();
  }

  // Función para ajustar la hora de una fecha
  private adjustDate(date: Date, endOfDay: boolean = false): Date {
    if (endOfDay) {
      date.setHours(23, 59, 59, 999); // Final del día
    } else {
      date.setHours(0, 0, 0, 0); // Inicio del día
    }
    return date;
  }

  getAll() {
    this.movimietosService.getAll(this.startOfMonth(), this.endOfMonth()).subscribe({
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
