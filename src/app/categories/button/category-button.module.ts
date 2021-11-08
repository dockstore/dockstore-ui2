import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CustomMaterialModule } from '../../shared/modules/material.module';

import { CategoryButtonComponent } from './category-button.component';

@NgModule({
  declarations: [CategoryButtonComponent],
  imports: [MatProgressBarModule, MatIconModule, CommonModule, FormsModule, RouterModule, CustomMaterialModule],
  exports: [CategoryButtonComponent],
})
export class CategoryButtonModule {}
