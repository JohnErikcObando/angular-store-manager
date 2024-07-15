import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageHeaderComponent } from '@shared';

@Component({
  selector: 'app-dashboard-v2',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent],
})
export class DashboardComponent {

}
