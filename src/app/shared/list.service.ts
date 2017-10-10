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

import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { ContainersService } from './swagger';
import { UsersService } from './swagger/api/users.service';
import { WorkflowsService } from './swagger/api/workflows.service';

@Injectable()
export class ListService {

  constructor(private containersService: ContainersService, private workflowsService: WorkflowsService,
    private usersService: UsersService) { }

  getPublishedTools(toolType: any): Observable<any> {
    if (toolType === 'workflows') {
      return this.workflowsService.allPublishedWorkflows();
    } else {
      return this.containersService.allPublishedContainers();
    }
  }

  getUserTools(userId: number) {
      return this.usersService.userContainers(userId);
    }
}
