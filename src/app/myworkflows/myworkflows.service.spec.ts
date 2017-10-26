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

import { Workflow } from './../shared/swagger/model/workflow';
import { MyWorkflowsService } from './myworkflows.service';
import { Tool } from './../shared/swagger/model/tool';
import { TestBed, inject } from '@angular/core/testing';

describe('MyWorkflowsService', () => {
  const tool1: Workflow = {
      defaultTestParameterFilePath: '',
      descriptorType: '',
      gitUrl: '',
      mode: Workflow.ModeEnum.FULL,
      organization: 'cc',
      repository: 'aa',
      workflow_path: ''
  };
  const tool2: Workflow = {
    defaultTestParameterFilePath: '',
    descriptorType: '',
    gitUrl: '',
    mode: Workflow.ModeEnum.FULL,
    organization: 'cc',
    repository: 'bb',
    workflow_path: ''
};
  const tool3: Workflow = {
    defaultTestParameterFilePath: '',
    descriptorType: '',
    gitUrl: '',
    mode: Workflow.ModeEnum.FULL,
    organization: 'bb',
    repository: 'cc',
    workflow_path: ''
};
  const tool4: Workflow = {
    defaultTestParameterFilePath: '',
    descriptorType: '',
    gitUrl: '',
    mode: Workflow.ModeEnum.FULL,
    organization: 'bb',
    repository: 'dd',
    workflow_path: ''
};
  const tool5: Workflow = {
    defaultTestParameterFilePath: '',
    descriptorType: '',
    gitUrl: '',
    mode: Workflow.ModeEnum.FULL,
    organization: 'aa',
    repository: 'ee',
    workflow_path: ''
};
  const tool6: Workflow = {
    defaultTestParameterFilePath: '',
    descriptorType: '',
    gitUrl: '',
    mode: Workflow.ModeEnum.FULL,
    organization: 'aa',
    repository: 'ee',
    workflow_path: '1'
};
  const tools: Workflow[] = [tool1, tool2, tool4, tool3, tool5, tool6];
  const expectedResult1 = {'containers': [(tool5), (tool6)], 'isFirstOpen': false, 'namespace': 'quay.io/aa'};
  const expectedResult2 = {'containers': [(tool3), (tool4)], 'isFirstOpen': false, 'namespace': 'quay.io/bb'};
  const expectedResult3 = {'containers': [(tool1), (tool2)], 'isFirstOpen': false, 'namespace': 'quay.io/cc'};
  const expectedResult: any = [expectedResult1, expectedResult2, expectedResult3];
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyWorkflowsService]
    });
  });
  it('should be truthy', inject([MyWorkflowsService], (service: MyWorkflowsService) => {
    expect(service).toBeTruthy();
  }));
  it('should ...', inject([MyWorkflowsService], (service: MyWorkflowsService) => {
    expect(service.sortORGWorkflows(tools, 'asdf').length).toBe(3);
    // expect(service.sortORGWorkflows(tools, 'asdf')).toEqual(expectedResult);
    expect(service.sortORGWorkflows([], 'asdf')).toEqual([]);
  }));
});
