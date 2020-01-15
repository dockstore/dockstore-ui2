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
import { EntryType } from 'app/shared/enum/entry-type';
import { Observable } from 'rxjs';
import { ContainersService, WorkflowsService } from '../shared/swagger';
import { UsersService } from './../shared/swagger/api/users.service';
import { StarRequest } from './../shared/swagger/model/starRequest';
import { User } from './../shared/swagger/model/user';

@Injectable()
export class StarringService {
  constructor(
    private usersService: UsersService,
    private containersService: ContainersService,
    private workflowsService: WorkflowsService
  ) {}

  putStar(entryID: number, entryType: EntryType, toStar: boolean): Observable<any> {
    const body: StarRequest = {
      star: toStar
    };
    if (entryType === EntryType.BioWorkflow) {
      return this.workflowsService.starEntry(entryID, body);
    } else {
      return this.containersService.starEntry(entryID, body);
    }
  }

  getStarring(entryID: number, entryType: EntryType): Observable<Array<User>> {
    if (entryType === EntryType.BioWorkflow) {
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
