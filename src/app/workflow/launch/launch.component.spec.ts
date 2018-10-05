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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GA4GHService } from '../../shared/swagger';
import { CheckerWorkflowService } from './../../shared/checker-workflow.service';
import { ContainerService } from './../../shared/container.service';
import { WorkflowService } from './../../shared/workflow.service';
import {
  CheckerWorkflowStubService,
  ContainerStubService,
  DescriptorsStubService,
  GA4GHStubService,
  WorkflowStubService,
} from './../../test/service-stubs';
import { WorkflowDescriptorService } from './../descriptors/workflow-descriptor.service';
import { LaunchWorkflowComponent } from './launch.component';
import { WorkflowLaunchService } from './workflow-launch.service';

describe('LaunchWorkflowComponent', () => {
  let component: LaunchWorkflowComponent;
  let fixture: ComponentFixture<LaunchWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LaunchWorkflowComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [WorkflowLaunchService, { provide: ContainerService, useClass: ContainerStubService },
        { provide: WorkflowDescriptorService, useClass: DescriptorsStubService },
        { provide: CheckerWorkflowService, useClass: CheckerWorkflowStubService },
        { provide: WorkflowService, useClass: WorkflowStubService},
        { provide: GA4GHService, useClass: GA4GHStubService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
