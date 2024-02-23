import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { PrivateIconComponent } from './private-icon.component';

@NgModule({
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  declarations: [PrivateIconComponent],
  exports: [PrivateIconComponent],
})
export class PrivateIconModule {}
