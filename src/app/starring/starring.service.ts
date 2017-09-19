import { User } from './../shared/swagger/model/user';
import { Observable } from 'rxjs/Observable';
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
    const body = {
      containerId: entryID,
      workflowId: entryID
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
