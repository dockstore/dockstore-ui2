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
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

import { ContainerModule } from '../shared/modules/container.module';
import { HeaderModule } from '../shared/modules/header.module';
import { ListContainersModule } from '../shared/modules/list-containers.module';
import { SelectModule } from '../shared/modules/select.module';
import { ContainersComponent } from './containers.component';
import { containersRouting } from './containers.routing';
import { SearchContainersComponent } from './search/search.component';

@NgModule({
  declarations: [ContainersComponent, SearchContainersComponent],
  imports: [CommonModule, HeaderModule, SelectModule, ListContainersModule, ContainerModule, containersRouting, MarkdownModule]
})
export class ContainersModule {}
