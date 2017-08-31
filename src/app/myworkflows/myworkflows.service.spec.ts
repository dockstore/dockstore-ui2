import { Workflow } from './../shared/swagger/model/workflow';
import { MyWorkflowsService } from './myworkflows.service';
import { Tool } from './../shared/swagger/model/tool';
import { TestBed, inject } from '@angular/core/testing';

describe('MyWorkflowsService', () => {
  const tool1: Workflow = {
      descriptorType: '',
      gitUrl: '',
      mode: Workflow.ModeEnum.FULL,
      organization: 'cc',
      repository: 'aa',
      workflow_path: ''
  };
  const tool2: Workflow = {
    descriptorType: '',
    gitUrl: '',
    mode: Workflow.ModeEnum.FULL,
    organization: 'cc',
    repository: 'bb',
    workflow_path: ''
};
  const tool3: Workflow = {
    descriptorType: '',
    gitUrl: '',
    mode: Workflow.ModeEnum.FULL,
    organization: 'bb',
    repository: 'cc',
    workflow_path: ''
};
  const tool4: Workflow = {
    descriptorType: '',
    gitUrl: '',
    mode: Workflow.ModeEnum.FULL,
    organization: 'bb',
    repository: 'dd',
    workflow_path: ''
};
  const tool5: Workflow = {
    descriptorType: '',
    gitUrl: '',
    mode: Workflow.ModeEnum.FULL,
    organization: 'aa',
    repository: 'ee',
    workflow_path: ''
};
  const tool6: Workflow = {
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
