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
