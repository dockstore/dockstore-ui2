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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule, MatIconModule, MatToolbarModule, MatTooltipModule, MatSnackBarModule } from '@angular/material';

import { RefreshService } from '../../shared/refresh.service';
import { WorkflowService } from '../../shared/state/workflow.service';
import { UsersService } from '../../shared/swagger/api/users.service';
import { RefreshStubService, UsersStubService, WorkflowStubService } from '../../test/service-stubs';
import { RefreshWorkflowOrganizationComponent } from './refresh-workflow-organization.component';

describe('RefreshWorkflowOrganizationComponent', () => {
  let component: RefreshWorkflowOrganizationComponent;
  let fixture: ComponentFixture<RefreshWorkflowOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefreshWorkflowOrganizationComponent ],
      imports: [
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatSnackBarModule
      ],
      providers: [
        { provide: UsersService, useClass: UsersStubService },
        { provide: WorkflowService, useClass: WorkflowStubService },
        { provide: RefreshService, useClass: RefreshStubService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefreshWorkflowOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
