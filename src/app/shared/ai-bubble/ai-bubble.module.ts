import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { RouterLink } from '@angular/router';
import { AiBubbleComponent } from './ai-bubble.component';

@NgModule({
  declarations: [AiBubbleComponent],
  exports: [AiBubbleComponent],
  imports: [CommonModule, FlexModule, MatIconModule, MatTooltipModule, RouterLink],
})
export class AiBubbleModule {}
