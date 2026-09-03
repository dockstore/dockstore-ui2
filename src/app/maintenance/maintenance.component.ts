import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatCardModule, MatIconModule],
})
export class MaintenanceComponent {}
