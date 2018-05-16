/*
 *    Copyright 2018 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License")
 *    you may not use this file except in compliance with the License
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import {
  InfoTabCheckerWorkflowPathComponent,
} from './info-tab-checker-workflow-path/info-tab-checker-workflow-path.component';
import { LaunchCheckerWorkflowComponent } from './launch-checker-workflow/launch-checker-workflow.component';
import { RegisterCheckerWorkflowComponent } from './register-checker-workflow/register-checker-workflow.component';
import { CodeEditorComponent } from './../code-editor/code-editor.component';
import { CodeEditorListComponent } from './../code-editor-list/code-editor-list.component';

@NgModule({
  imports: [
    CommonModule,
    TooltipModule.forRoot(),
    FormsModule,
    ModalModule
  ],
  declarations: [
    InfoTabCheckerWorkflowPathComponent,
    RegisterCheckerWorkflowComponent,
    LaunchCheckerWorkflowComponent,
    CodeEditorComponent,
    CodeEditorListComponent
  ],
  exports: [
    InfoTabCheckerWorkflowPathComponent,
    LaunchCheckerWorkflowComponent,
    CodeEditorComponent,
    CodeEditorListComponent
  ]
})
export class EntryModule { }
