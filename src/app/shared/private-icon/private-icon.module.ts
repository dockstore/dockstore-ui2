import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateIconComponent } from './private-icon.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PrivateIconComponent],
  exports: [PrivateIconComponent]
})
export class PrivateIconModule { }
