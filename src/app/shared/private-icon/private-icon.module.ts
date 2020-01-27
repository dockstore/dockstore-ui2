import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { PrivateIconComponent } from './private-icon.component';
import { MatTooltipModule } from '@angular/material';

@NgModule({
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  declarations: [PrivateIconComponent],
  exports: [PrivateIconComponent]
})
export class PrivateIconModule {}
