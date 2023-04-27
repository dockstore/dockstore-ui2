import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-preview-warning',
  templateUrl: './preview-warning.component.html',
})
export class PreviewWarningComponent {
  @Input() featureName: string;
}
