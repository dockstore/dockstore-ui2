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
import { AlertService } from './../shared/alert/state/alert.service';

@Injectable()
export class StarringService {
  constructor(private usersService: UsersService, private containersService: ContainersService,
    private workflowsService: WorkflowsService, private alertService: AlertService,) { }

  setUnstar(entryID: number, entryType: string): any {
    const message1 = "Unstarring workflow"
    const message2 = "Unstarring tool"

    if (entryType === 'workflows') {
      this.alertService.start(message1);
      return this.workflowsService.unstarEntry(entryID);
    } else {
      this.alertService.start(message2);
      return this.containersService.unstarEntry(entryID);
    }
  }

  setStar(entryID: number, entryType: string): any {
    const body: StarRequest = {
      star: true
    };
    const message1 = "Starring workflow"
    const message2 = "Starring tool"

    if (entryType === 'workflows') {
      this.alertService.start(message1);
      return this.workflowsService.starEntry(entryID, body);
    } else {
      this.alertService.start(message2);
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
