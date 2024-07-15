import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';

import { Chart, registerables } from 'chart.js';

// interfaces
import { VentasPorSemana } from 'app/interfaces';

// servicios
import { DashBoardService } from 'app/services/dashBoard.service';

Chart.register(...registerables);

@Component({
  selector: 'app-horizontal-bar-charts',
  standalone: true,
  template: `
    <div class="chart-container">
      <canvas #horizontalBarChart></canvas>
    </div>
  `,
  styles: `
    .chart-container {
      width: 100%;
      height: 100%;
    }
  `,
})
export class HorizontalBarChartsComponent implements OnInit {
  @ViewChild('horizontalBarChart') horizontalBarChartRef!: ElementRef;

  ventasSemana: VentasPorSemana[] = [];

  private dashBoardService = inject(DashBoardService);

  constructor() {}

  ngOnInit(): void {
    this.getVentaSemana();
  }

  private getVentaSemana() {
    this.dashBoardService.getVentasSemana().subscribe(rta => {
      this.ventasSemana = rta;
      this.createHorizontalBarChart();
    });
  }

  private createHorizontalBarChart() {
    const ctx = this.horizontalBarChartRef.nativeElement.getContext('2d');
    if (ctx) {
      const dias = this.ventasSemana.map(venta => venta.dia);
      const montos = this.ventasSemana.map(venta => venta.total);

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: dias,
          datasets: [
            {
              label: 'Ventas Semanales',
              data: montos,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          indexAxis: 'y',
        },
      });
    }

    // Ajustar el tamaño del canvas al contenedor
    const container = this.horizontalBarChartRef?.nativeElement.parentElement;
    if (container) {
      container.style.width = '100%';
      container.style.height = '100%';

      // Aplicar estilos al canvas
      const canvas = this.horizontalBarChartRef?.nativeElement;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    }
  }
}
