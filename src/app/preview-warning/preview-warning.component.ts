import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-preview-warning',
  templateUrl: './preview-warning.component.html',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
})
export class PreviewWarningComponent {
  @Input() featureName: string;
}
