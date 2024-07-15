// bar-charts.component.ts
import { Component, ElementRef, OnInit, ViewChild, OnDestroy, inject } from '@angular/core';

import { Chart, registerables } from 'chart.js';

// interfaces
import { MovimientoTipoMes } from 'app/interfaces';

// servicios
import { DashBoardService } from 'app/services/dashBoard.service';

@Component({
  selector: 'app-bar-charts',
  template: `
    <div class="chart-container">
      <canvas #barChart></canvas>
    </div>
  `,
  standalone: true,
  styles: `
    .chart-container {
      width: 100%;
      height: 100%;
    }
  `,
})
export class BarChartsComponent implements OnInit, OnDestroy {
  @ViewChild('barChart', { static: true }) barChartRef: ElementRef | undefined;

  private barChart: any;
  private movimientoMes: MovimientoTipoMes[] = [];

  private dashboardService = inject(DashBoardService);

  constructor() {}

  createBarChart(): void {
    if (this.barChart) {
      this.barChart.destroy();
    }

    const dataPorMes = this.procesarDatos(this.movimientoMes);

    const ctx = this.barChartRef?.nativeElement.getContext('2d');
    if (ctx) {
      this.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: dataPorMes.map(dato => dato.mes),

          datasets: [
            {
              label: 'Gasto',
              data: dataPorMes.map(dato => dato.gasto),
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
            {
              label: 'Venta',
              data: dataPorMes.map(dato => dato.venta),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,

          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
            },
          },
        },
      });
    }

    // Ajustar el tamaño del canvas al contenedor
    const container = this.barChartRef?.nativeElement.parentElement;
    if (container) {
      container.style.width = '100%';
      container.style.height = '100%';

      // Aplicar estilos al canvas
      const canvas = this.barChartRef?.nativeElement;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    }
  }

  ngOnInit(): void {
    Chart.register(...registerables);

    this.dashboardService.getMovimientosMes().subscribe({
      next: rta => {
        this.movimientoMes = rta;
        this.createBarChart();
      },
      error: e => {
        console.error('Error al obtener los datos:', e);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.barChart) {
      this.barChart.destroy();
    }
  }

  private procesarDatos(datos: any[]): any[] {
    const datosProcesados: any[] = [];

    datos.forEach(dato => {
      const mesExistente = datosProcesados.find(item => item.mes === dato.mes);

      if (mesExistente) {
        if (dato.tipo === 'Venta') {
          mesExistente.venta += dato.valor;
        } else if (dato.tipo === 'Gasto') {
          mesExistente.gasto += dato.valor;
        }
      } else {
        const nuevoMes = {
          mes: dato.mes,
          venta: dato.tipo === 'Venta' ? dato.valor : 0,
          gasto: dato.tipo === 'Gasto' ? dato.valor : 0,
        };
        datosProcesados.push(nuevoMes);
      }
    });

    return datosProcesados;
  }
}
