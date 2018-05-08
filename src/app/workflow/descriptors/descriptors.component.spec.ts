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

import { WorkflowDescriptorService } from './workflow-descriptor.service';
import { WorkflowService } from './../../shared/workflow.service';
import { FileService } from './../../shared/file.service';
import { DescriptorsStubService, FileStubService, WorkflowStubService } from './../../test/service-stubs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DescriptorsWorkflowComponent } from './descriptors.component';

describe('DescriptorsWorkflowComponent', () => {
  let component: DescriptorsWorkflowComponent;
  let fixture: ComponentFixture<DescriptorsWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescriptorsWorkflowComponent ],
      providers: [ {
        provide: WorkflowDescriptorService, useClass: DescriptorsStubService
      }, {provide: FileService, useClass: FileStubService}, {
        provide: WorkflowService, useClass: WorkflowStubService
      }],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptorsWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
