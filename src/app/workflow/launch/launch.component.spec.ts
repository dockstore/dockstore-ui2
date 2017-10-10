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

import { DescriptorService } from '../../shared/descriptor.service';
import { WorkflowDescriptorService } from './../descriptors/workflow-descriptor.service';
import { ContainerStubService, DescriptorsStubService } from './../../test/service-stubs';
import { ContainerService } from './../../shared/container.service';
import { WorkflowLaunchService } from './workflow-launch.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LaunchWorkflowComponent } from './launch.component';

describe('LaunchWorkflowComponent', () => {
  let component: LaunchWorkflowComponent;
  let fixture: ComponentFixture<LaunchWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaunchWorkflowComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [ WorkflowLaunchService, {provide: ContainerService, useClass: ContainerStubService},
      { provide: WorkflowDescriptorService, useClass: DescriptorsStubService}]
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
