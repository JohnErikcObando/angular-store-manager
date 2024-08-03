import {
  Component,
  inject,
  signal,
  ViewChild,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';

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
import { Inventario } from 'app/interfaces';

// services
import { InventarioService } from 'app/services';

import { PageHeaderComponent } from '@shared';

@Component({
  selector: 'app-dashboard-v2',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
})
export class DashboardComponent implements OnInit {
  inventario = signal<Inventario[]>([]);

  displayedColumns: string[] = ['producto', 'entrada', 'salida', 'total'];

  dataSource = new MatTableDataSource<Inventario>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private inventarioService = inject(InventarioService);

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.inventarioService.getAll().subscribe({
      next: data => {
        this.inventario.set(data);
        this.dataSource = new MatTableDataSource<Inventario>(this.inventario());
        this.dataSource.paginator = this.paginator;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
