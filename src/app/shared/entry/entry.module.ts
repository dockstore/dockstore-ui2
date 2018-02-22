import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import {
  InfoTabCheckerWorkflowPathComponent,
} from './info-tab-checker-workflow-path/info-tab-checker-workflow-path.component';
import { LaunchCheckerWorkflowComponent } from './launch-checker-workflow/launch-checker-workflow.component';

@NgModule({
  imports: [
    CommonModule,
    TooltipModule.forRoot()
  ],
  declarations: [InfoTabCheckerWorkflowPathComponent,
    LaunchCheckerWorkflowComponent
  ],
  exports: [InfoTabCheckerWorkflowPathComponent, LaunchCheckerWorkflowComponent]
})
export class EntryModule { }
