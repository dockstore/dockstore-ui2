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

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ContainersService } from './swagger';
import { UsersService } from './swagger/api/users.service';
import { WorkflowsService } from './swagger/api/workflows.service';

@Injectable()
export class ListService {
  constructor(
    private containersService: ContainersService,
    private workflowsService: WorkflowsService,
    private usersService: UsersService
  ) {}

  // TODO: need someone to pick up here to connect this to the data tables pagination for
  // public tools and workflows
  getPublishedToolsByPage(toolType: any, offset: number, limit: number): Observable<any> {
    if (toolType === 'workflows') {
      return this.workflowsService.allPublishedWorkflows(offset, limit);
    } else {
      return this.containersService.allPublishedContainers(offset, limit);
    }
  }

  getPublishedTools(toolType: any, preview: boolean): Observable<any> {
    if (toolType === 'workflows') {
      if (preview) {
        return this.workflowsService.allPublishedWorkflows(0, 10);
      }
      return this.workflowsService.allPublishedWorkflows();
    } else {
      if (preview) {
        return this.containersService.allPublishedContainers(0, 10);
      }
      return this.containersService.allPublishedContainers();
    }
  }

  getUserTools(userId: number) {
    return this.usersService.userContainers(userId);
  }
}
