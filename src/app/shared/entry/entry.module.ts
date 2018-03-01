import { RegisterCheckerWorkflowService } from './register-checker-workflow/register-checker-workflow.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import {
  InfoTabCheckerWorkflowPathComponent,
} from './info-tab-checker-workflow-path/info-tab-checker-workflow-path.component';
import { LaunchCheckerWorkflowComponent } from './launch-checker-workflow/launch-checker-workflow.component';
import { RegisterCheckerWorkflowComponent } from './register-checker-workflow/register-checker-workflow.component';


@NgModule({
  imports: [
    CommonModule,
    TooltipModule.forRoot(),
    FormsModule,
    ModalModule
  ],
  declarations: [InfoTabCheckerWorkflowPathComponent, RegisterCheckerWorkflowComponent,
    LaunchCheckerWorkflowComponent
  ],
  exports: [InfoTabCheckerWorkflowPathComponent, LaunchCheckerWorkflowComponent]
})
export class EntryModule { }
