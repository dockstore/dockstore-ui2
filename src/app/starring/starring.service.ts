import { StarRequest } from './../shared/swagger/model/starRequest';
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

import { User } from './../shared/swagger/model/user';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { ContainersService, WorkflowsService } from '../shared/swagger';
import { UsersService } from './../shared/swagger/api/users.service';

@Injectable()
export class StarringService {
  constructor(private usersService: UsersService, private containersService: ContainersService,
    private workflowsService: WorkflowsService) { }

  setUnstar(entryID: number, entryType: string): any {

    if (entryType === 'workflows') {
      return this.workflowsService.unstarEntry(entryID);
    } else {
      return this.containersService.unstarEntry(entryID);
    }
  }

  setStar(entryID: number, entryType: string): any {
    const body: StarRequest = {
      star: true
    };

    if (entryType === 'workflows') {
      return this.workflowsService.starEntry(entryID, body);
    } else {
      return this.containersService.starEntry(entryID, body);
    }
  }

  getStarring(entryID: number, entryType: string): Observable<Array<User>> {
    if (entryType === 'workflows') {
      return this.workflowsService.getStarredUsers(entryID);
    } else {
      return this.containersService.getStarredUsers(entryID);
    }
  }

  getStarredTools(): any {
    return this.usersService.getStarredTools();
  }

  getStarredWorkflows(): any {
    return this.usersService.getStarredWorkflows();
  }
}
