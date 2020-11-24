/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import { RouterModule, Routes } from '@angular/router';
import { EntryType } from 'app/shared/enum/entry-type';
import { WorkflowComponent } from '../workflow/workflow.component';
import { SearchWorkflowsComponent } from './search/search.component';
import { WorkflowsComponent } from './workflows.component';

const WORKFLOWS_ROUTES: Routes = [
  {
    path: '',
    component: WorkflowsComponent,
    data: { title: 'Dockstore | Workflow', entryType: EntryType.BioWorkflow },
    children: [
      { path: '', component: SearchWorkflowsComponent, data: { title: 'Dockstore | Workflows' } },
      { path: '**', component: WorkflowComponent, data: { title: 'Dockstore | Workflow' } },
    ],
  },
];

export const workflowsRouting = RouterModule.forChild(WORKFLOWS_ROUTES);
