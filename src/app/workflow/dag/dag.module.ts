import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DagComponent } from './dag.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DagComponent],
  exports: [DagComponent]
})
export class DagModule { }
