import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
export class PreviewWarningComponent implements OnInit {
  @Input() featureName: string;
  @Input() isBubble: boolean = false;

  public previewMessage: string;

  ngOnInit(): void {
    this.previewMessage = `${this.featureName} is an early access feature. Consider this a prototype that may be more likely to have breaking changes going forward than other Dockstore features.`;
  }
}
