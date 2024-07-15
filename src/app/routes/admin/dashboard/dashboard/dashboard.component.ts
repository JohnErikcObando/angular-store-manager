import { Component } from '@angular/core';

// material
import { MatCardModule } from '@angular/material/card';

import { PageHeaderComponent } from '@shared';

import { BarChartsComponent } from '../components/chartJs/bar-charts.component';
import { BarGroupsChartsComponent } from '../components/chartJs/bar-groups-charts.component';
import { HorizontalBarChartsComponent } from '../components/chartJs/horizontal-bar-charts.component';
import { LineChartsComponent } from '../components/chartJs/line-charts.component';
import { PieChartsComponent } from '../components/chartJs/pie-charts.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    BarChartsComponent,
    BarGroupsChartsComponent,
    HorizontalBarChartsComponent,
    LineChartsComponent,
    MatCardModule,
    PageHeaderComponent,
    PieChartsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
