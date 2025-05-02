import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-preview-warning',
  templateUrl: './preview-warning.component.html',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatChipsModule, MatTooltipModule, NgIf],
})
export class PreviewWarningComponent {
  @Input() featureName: string;
  @Input() isBubble: boolean = false;
}
