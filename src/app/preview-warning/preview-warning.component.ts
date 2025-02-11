import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCardModule } from '@angular/material/legacy-card';

@Component({
  selector: 'app-preview-warning',
  templateUrl: './preview-warning.component.html',
  standalone: true,
  imports: [MatLegacyCardModule, MatIconModule],
})
export class PreviewWarningComponent {
  @Input() featureName: string;
}
