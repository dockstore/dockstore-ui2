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

import { Routes } from '@angular/router';
import { EntryType } from 'app/shared/enum/entry-type';
import { ContainerComponent } from '../container/container.component';
import { ContainersComponent } from './containers.component';
import { SearchContainersComponent } from './search/search.component';

const CONTAINERS_ROUTES: Routes = [
  {
    path: '',
    component: ContainersComponent,
    data: { title: 'Dockstore | Tool', entryType: EntryType.Tool },
    children: [
      { path: '', component: SearchContainersComponent, data: { title: 'Dockstore | Tools' } },
      { path: '**', component: ContainerComponent, data: { title: 'Dockstore | Tool' } },
    ],
  },
];

export const containersRouting = CONTAINERS_ROUTES;
