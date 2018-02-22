import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import {
  InfoTabCheckerWorkflowPathComponent,
} from './info-tab-checker-workflow-path/info-tab-checker-workflow-path.component';

@NgModule({
  imports: [
    CommonModule,
    TooltipModule.forRoot()
  ],
  declarations: [InfoTabCheckerWorkflowPathComponent],
  exports: [InfoTabCheckerWorkflowPathComponent]
})
export class EntryModule { }
