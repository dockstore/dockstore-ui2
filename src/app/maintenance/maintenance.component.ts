import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCardModule } from '@angular/material/legacy-card';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss'],
  standalone: true,
  imports: [MatLegacyCardModule, MatIconModule],
})
export class MaintenanceComponent {}
