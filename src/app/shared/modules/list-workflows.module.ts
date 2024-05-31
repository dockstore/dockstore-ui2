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
import { RouterModule } from '@angular/router';
import { ListWorkflowsComponent } from '../../workflows/list/list.component';
import { PublishedWorkflowsDataSource } from '../../workflows/list/published-workflows.datasource';
import { EntryModule } from '../entry/entry.module';
import { PipeModule } from '../pipe/pipe.module';

@NgModule({
  imports: [CommonModule, RouterModule, EntryModule, PipeModule, ListWorkflowsComponent],
  providers: [PublishedWorkflowsDataSource],
  exports: [ListWorkflowsComponent],
})
export class ListWorkflowsModule {}
