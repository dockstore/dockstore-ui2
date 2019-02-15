/**
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

import { MyWorkflowComponent } from './my-workflow/my-workflow.component';
import { MyWorkflowsComponent } from './myworkflows.component';
import {MyToolsComponent} from '../mytools/mytools.component';

const MYTOOLS_ROUTES: Routes = [
  {
    path: '', component: MyWorkflowsComponent, data: {title: 'Dockstore | My Workflows'}, children: [
      { path: '**', component: MyWorkflowComponent, data: {title: 'Dockstore | My Workflows'} }
    ]
  }
];
export const myworkflowRouting = RouterModule.forChild(MYTOOLS_ROUTES);
