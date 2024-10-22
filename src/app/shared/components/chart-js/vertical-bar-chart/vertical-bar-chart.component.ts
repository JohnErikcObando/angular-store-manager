import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-vertical-bar-chart',
  standalone: true,
  template: `
    <div class="chart-container">
      <canvas #barChart></canvas>
    </div>
  `,
  styles: [
    `
      .chart-container {
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class VerticalBarChartComponent implements OnInit, OnChanges {
  @ViewChild('barChart', { static: true }) barChartRef: ElementRef | undefined;

  // Inputs para recibir datos y configuraciones
  @Input() chartLabels: string[] = [];
  @Input() chartData: any[] = [];
  @Input() chartTitle: string = '';
  @Input() backgroundColors: string[] = ['rgba(75, 192, 192, 0.2)'];
  @Input() borderColors: string[] = ['rgba(75, 192, 192, 1)'];

  private barChart: any;

  constructor() {}

  createBarChart(): void {
    if (this.barChart) {
      this.barChart.destroy();
    }

    const ctx = this.barChartRef?.nativeElement.getContext('2d');
    if (ctx) {
      this.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.chartLabels,
          datasets: this.chartData.map((dataset, index) => ({
            label: dataset.label,
            data: dataset.data,
            backgroundColor: this.backgroundColors[index] || this.backgroundColors[0],
            borderColor: this.borderColors[index] || this.borderColors[0],
            borderWidth: 1,
          })),
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: !!this.chartTitle,
              text: this.chartTitle,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }

  ngOnInit(): void {
    Chart.register(...registerables);
  }

  // Detecta cambios en los Inputs
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.chartLabels || changes.chartData) {
      this.createBarChart();
    }
  }

  ngOnDestroy(): void {
    if (this.barChart) {
      this.barChart.destroy();
    }
  }
}
