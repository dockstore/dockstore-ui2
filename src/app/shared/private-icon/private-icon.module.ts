import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material';

import { PrivateIconComponent } from './private-icon.component';

@NgModule({
  imports: [CommonModule, MatIconModule],
  declarations: [PrivateIconComponent],
  exports: [PrivateIconComponent]
})
export class PrivateIconModule {}
