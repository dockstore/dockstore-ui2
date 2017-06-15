import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { DagComponent } from './dag.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule
  ],
  declarations: [DagComponent],
  exports: [DagComponent]
})
export class DagModule { }
