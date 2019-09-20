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

import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EntryType } from 'app/shared/enum/entry-type';
import { CustomMaterialModule } from 'app/shared/modules/material.module';
import { MyEntriesModule } from 'app/shared/modules/my-entries.module';
import { WorkflowService } from 'app/shared/state/workflow.service';
import { UsersService, WorkflowsService } from 'app/shared/swagger';
import { UsersStubService, WorkflowsStubService, WorkflowStubService } from 'app/test/service-stubs';
import { Workflow } from './../shared/swagger/model/workflow';
import { MyBioWorkflowsService } from './my-bio-workflows.service';
import { MyServicesService } from './my-services.service';
import { MyWorkflowsService } from './myworkflows.service';

describe('MyWorkflowsService', () => {
  const tool1: Workflow = {
    defaultTestParameterFilePath: '',
    descriptorType: null,
    gitUrl: '',
    mode: Workflow.ModeEnum.FULL,
    organization: 'cc',
    repository: 'aa',
    workflow_path: '',
    sourceControl: 'github.com',
    path: 'github.com/cc/aa',
    full_workflow_path: 'github.com/cc/aa',
    source_control_provider: 'GITHUB'
  };
  const tool2: Workflow = {
    defaultTestParameterFilePath: '',
    descriptorType: null,
    gitUrl: '',
    mode: Workflow.ModeEnum.FULL,
    organization: 'cc',
    repository: 'bb',
    workflow_path: '',
    sourceControl: 'github.com',
    path: 'github.com/cc/bb',
    full_workflow_path: 'github.com/cc/bb',
    source_control_provider: 'GITHUB'
  };
  const tool3: Workflow = {
    defaultTestParameterFilePath: '',
    descriptorType: null,
    gitUrl: '',
    mode: Workflow.ModeEnum.FULL,
    organization: 'bb',
    repository: 'cc',
    workflow_path: '',
    sourceControl: 'github.com',
    path: 'github.com/bb/cc',
    full_workflow_path: 'github.com/bb/cc',
    source_control_provider: 'GITHUB'
  };
  const tool4: Workflow = {
    defaultTestParameterFilePath: '',
    descriptorType: null,
    gitUrl: '',
    mode: Workflow.ModeEnum.FULL,
    organization: 'bb',
    repository: 'dd',
    workflow_path: '',
    sourceControl: 'github.com',
    path: 'github.com/bb/dd',
    full_workflow_path: 'github.com/bb/dd',
    source_control_provider: 'GITHUB'
  };
  const tool5: Workflow = {
    defaultTestParameterFilePath: '',
    descriptorType: null,
    gitUrl: '',
    mode: Workflow.ModeEnum.FULL,
    organization: 'aa',
    repository: 'ee',
    workflow_path: '',
    sourceControl: 'github.com',
    path: 'github.com/aa/ee',
    full_workflow_path: 'github.com/aa/ee',
    source_control_provider: 'GITHUB'
  };
  const tool6: Workflow = {
    defaultTestParameterFilePath: '',
    descriptorType: null,
    gitUrl: '',
    mode: Workflow.ModeEnum.FULL,
    organization: 'aa',
    repository: 'ee',
    workflow_path: '1',
    sourceControl: 'github.com',
    path: 'github.com/aa/ee',
    full_workflow_path: 'github.com/aa/ee',
    source_control_provider: 'GITHUB'
  };
  const tools: Workflow[] = [tool1, tool2, tool4, tool3, tool5, tool6];
  const expectedResult1 = {
    entries: [tool5, tool6],
    isFirstOpen: false,
    namespace: 'github.com/aa',
    sourceControl: 'github.com',
    organization: 'aa'
  };
  const expectedResult2 = {
    entries: [tool3, tool4],
    isFirstOpen: false,
    namespace: 'github.com/bb',
    sourceControl: 'github.com',
    organization: 'bb'
  };
  const expectedResult3 = {
    entries: [tool1, tool2],
    isFirstOpen: false,
    namespace: 'github.com/cc',
    sourceControl: 'github.com',
    organization: 'cc'
  };
  const expectedResult: any = [expectedResult1, expectedResult2, expectedResult3];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomMaterialModule, RouterTestingModule, MyEntriesModule],
      providers: [
        MyWorkflowsService,
        MyBioWorkflowsService,
        MyServicesService,
        { provide: WorkflowService, useClass: WorkflowStubService },
        { provide: UsersService, useClass: UsersStubService },
        { provide: WorkflowsService, useClass: WorkflowsStubService }
      ]
    });
  });
  it('should be truthy', inject([MyWorkflowsService], (service: MyWorkflowsService) => {
    expect(service).toBeTruthy();
  }));
  it('should ...', inject([MyWorkflowsService], (service: MyWorkflowsService) => {
    expect(service.sortGroupEntries(tools, 'asdf', EntryType.BioWorkflow).length).toBe(3);
    expect(service.sortGroupEntries(tools, 'asdf', EntryType.BioWorkflow)).toEqual(expectedResult);
    expect(service.sortGroupEntries([], 'asdf', EntryType.BioWorkflow)).toEqual([]);
  }));
});
