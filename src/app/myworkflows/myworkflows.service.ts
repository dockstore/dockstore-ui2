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

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { WorkflowService } from 'app/shared/state/workflow.service';
import { UsersService, WorkflowsService } from 'app/shared/swagger';
import { UserQuery } from 'app/shared/user/user.query';
import { forkJoin, of as observableOf, combineLatest } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { MyEntriesService } from './../shared/myentries.service';
import { WorkflowQuery } from 'app/shared/state/workflow.query';
import { WorkflowClass } from 'app/shared/enum/workflow-class';

@Injectable()
export class MyWorkflowsService extends MyEntriesService {
  constructor(
    protected userQuery: UserQuery,
    private workflowQuery: WorkflowQuery,
    protected alertService: AlertService,
    protected usersService: UsersService,
    protected workflowService: WorkflowService,
    protected workflowsService: WorkflowsService
  ) {
    super();
  }

  getGroupIndex(groupEntries: any[], group: string): number {
    return groupEntries.findIndex(orgWorkflow => orgWorkflow.sourceControl + '/' + orgWorkflow.organization === group);
  }

  clearPartialState(): void {
    this.workflowService.setWorkflow(null);
    this.workflowService.setWorkflows(null);
    this.workflowService.setSharedWorkflows(null);
  }

  // Given enum name, returns the friendly name
  // TODO: This should be connected to the existing enum in the workflow model, however that does
  // not have the friendly names
  getSourceControlFriendlyName(sourceControlEnum: string): string {
    if (sourceControlEnum === 'GITHUB') {
      return 'github.com';
    } else if (sourceControlEnum === 'GITLAB') {
      return 'gitlab.com';
    } else if (sourceControlEnum === 'BITBUCKET') {
      return 'bitbucket.org';
    }
    return null;
  }

  // Retrieve all of the workflows for the user and update the workflow service
  // TODO: Fix this. What should happen is:
  // If none of the two calls error, there should be a simple snackBar displayed
  // If one of the two calls error, there should be a detailed card displayed
  // If two of the calls error, there should be a weird combined detailed card displayed
  // Any errors should still return an empty array for that set of workflows
  getMyEntries(): void {
    combineLatest(this.userQuery.user$, this.workflowQuery.workflowClass$)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([user, workflowClass]) => {
        const workflowClassName = this.workflowQuery.getWorkflowClass(workflowClass);
        if (user && workflowClassName) {
          this.alertService.start('Fetching ' + workflowClassName + 's');
          if (workflowClass === WorkflowClass.BioWorkflow) {
            this.getMyBioWorkflows(user.id);
          } else {
            this.getMyServices();
          }
        }
      });
  }

  getMyBioWorkflows(id: number) {
    forkJoin(
      this.usersService.userWorkflows(id).pipe(
        catchError((error: HttpErrorResponse) => {
          this.alertService.detailedSnackBarError(error);
          return observableOf([]);
        })
      ),
      this.workflowsService.sharedWorkflows().pipe(
        catchError((error: HttpErrorResponse) => {
          this.alertService.detailedSnackBarError(error);
          return observableOf([]);
        })
      )
    )
      .pipe(
        finalize(() => this.alertService.simpleSuccess()),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        ([workflows, sharedWorkflows]) => {
          this.workflowService.setWorkflows(workflows);
          this.workflowService.setSharedWorkflows(sharedWorkflows);
        },
        error => {
          console.error('This should be impossible because both errors are caught already');
        }
      );
  }

  getMyServices() {}
}
