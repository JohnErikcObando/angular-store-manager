import { DashBoardService } from 'app/services/dashBoard.service';
import { Component, inject, signal } from '@angular/core';

// material
import { MatCardModule } from '@angular/material/card';

import { PageHeaderComponent } from '@shared';

import { BarGroupsChartsComponent } from '../components/chartJs/bar-groups-charts.component';
import { HorizontalBarChartsComponent } from '../components/chartJs/horizontal-bar-charts.component';
import { LineChartsComponent } from '../components/chartJs/line-charts.component';
import { PieChartsComponent } from '../components/chartJs/pie-charts.component';
import { VerticalBarChartComponent } from '../../../../shared/components/chart-js/vertical-bar-chart/vertical-bar-chart.component';
import { ChartData, DataVerticalBar } from '@shared/interfaces/verticalBar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    BarGroupsChartsComponent,
    HorizontalBarChartsComponent,
    LineChartsComponent,
    MatCardModule,
    PageHeaderComponent,
    PieChartsComponent,
    VerticalBarChartComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private dashBoardService = inject(DashBoardService);

  categoriasLabels: string[] = [];
  categoriasChartData: ChartData[] = [];

  movimientosLabels: string[] = [];
  movimientosChartData: ChartData[] = [];

  totalVenta = signal(0);
  totalGasto = signal(0);

  ngOnInit(): void {
    this.getCategoriaMes();
    this.getMovimientosMes();
  }

  getMovimientosMes() {
    this.dashBoardService.getMovimientosMes().subscribe(data => {
      const result = this.processChartData(data);
      this.movimientosLabels = result.labels;
      this.movimientosChartData = result.chartData;
    });
  }

  getCategoriaMes() {
    this.dashBoardService.getCategoriaMes().subscribe(data => {
      const result = this.processChartData(data);
      this.categoriasLabels = result.labels;
      this.categoriasChartData = result.chartData;
    });
  }

  processChartData(data: DataVerticalBar[]) {
    // Mapa para agrupar los valores por mes y tipo
    const mesMap = new Map<string, Map<string, number>>();

    data.forEach(item => {
      const { mes, tipo, valor } = item;

      if (!mesMap.has(mes)) {
        mesMap.set(mes, new Map<string, number>());
      }

      const tipoMap = mesMap.get(mes)!;

      if (tipoMap.has(tipo)) {
        tipoMap.set(tipo, tipoMap.get(tipo)! + valor);
      } else {
        tipoMap.set(tipo, valor);
      }
    });

    // Obtener todas las categorías/tipos únicos
    const tiposUnicos = new Set<string>();
    mesMap.forEach(tipoMap => {
      tipoMap.forEach((_, tipo) => tiposUnicos.add(tipo));
    });

    const labels = Array.from(mesMap.keys());

    // Crear los datasets por cada tipo/categoría
    const chartData = Array.from(tiposUnicos).map(tipo => {
      return {
        label: tipo,
        data: labels.map(mes => {
          const tipoMap = mesMap.get(mes);
          return tipoMap?.get(tipo) || 0;
        }),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      };
    });

    return { labels, chartData };
  }
}
