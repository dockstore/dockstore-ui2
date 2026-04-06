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

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { ContainerService } from 'app/shared/container.service';
import { UrlResolverService } from 'app/shared/url-resolver.service';
import { ContainerStubService, DateStubService, WorkflowsStubService } from 'app/test/service-stubs';
import { MyWorkflowsService } from '../myworkflows/myworkflows.service';
import { DateService } from '../shared/date.service';
import { DescriptorLanguageService } from '../shared/entry/descriptor-language.service';
import { DockstoreTool, Workflow, WorkflowsService } from '../shared/openapi';
import { ProviderService } from '../shared/provider.service';
import { MyEntriesStateService } from '../shared/state/my-entries.service';
import { MyEntriesStore } from '../shared/state/my-entries.store';
import { OrgToolObject } from './my-tool/my-tool.component';
import { MytoolsService } from './mytools.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MytoolsService', () => {
  const tool1: DockstoreTool = {
    defaultWDLTestParameterFile: '',
    defaultCWLTestParameterFile: '',
    default_cwl_path: '',
    default_dockerfile_path: '',
    default_wdl_path: '',
    gitUrl: '',
    mode: DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS,
    name: 'aa',
    namespace: 'cc',
    private_access: false,
    registry_string: 'quay.io',
    registry: DockstoreTool.RegistryEnum.QUAYIO,
    toolname: '',
    tool_path: 'quay.io/cc/aa',
    path: 'quay.io/cc/aa',
  };
  const tool2: DockstoreTool = {
    defaultWDLTestParameterFile: '',
    defaultCWLTestParameterFile: '',
    default_cwl_path: '',
    default_dockerfile_path: '',
    default_wdl_path: '',
    gitUrl: '',
    mode: DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS,
    name: 'bb',
    namespace: 'cc',
    private_access: false,
    registry_string: 'quay.io',
    registry: DockstoreTool.RegistryEnum.QUAYIO,
    toolname: '',
    tool_path: 'quay.io/cc/bb',
    path: 'quay.io/cc/bb',
  };
  const tool3: DockstoreTool = {
    defaultWDLTestParameterFile: '',
    defaultCWLTestParameterFile: '',
    default_cwl_path: '',
    default_dockerfile_path: '',
    default_wdl_path: '',
    gitUrl: '',
    mode: DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS,
    name: 'cc',
    namespace: 'bb',
    private_access: false,
    registry_string: 'quay.io',
    registry: DockstoreTool.RegistryEnum.QUAYIO,
    toolname: '',
    tool_path: 'quay.io/bb/cc',
    path: 'quay.io/bb/cc',
  };
  const tool4: DockstoreTool = {
    defaultWDLTestParameterFile: '',
    defaultCWLTestParameterFile: '',
    default_cwl_path: '',
    default_dockerfile_path: '',
    default_wdl_path: '',
    gitUrl: '',
    mode: DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS,
    name: 'dd',
    namespace: 'bb',
    private_access: false,
    registry_string: 'quay.io',
    registry: DockstoreTool.RegistryEnum.QUAYIO,
    toolname: '',
    tool_path: 'quay.io/bb/dd',
    path: 'quay.io/bb/dd',
  };
  const tool5: DockstoreTool = {
    defaultWDLTestParameterFile: '',
    defaultCWLTestParameterFile: '',
    default_cwl_path: '',
    default_dockerfile_path: '',
    default_wdl_path: '',
    gitUrl: '',
    mode: DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS,
    name: 'ee',
    namespace: 'aa',
    private_access: false,
    registry_string: 'quay.io',
    registry: DockstoreTool.RegistryEnum.QUAYIO,
    toolname: '',
    tool_path: 'quay.io/aa/ee',
    path: 'quay.io/aa/ee',
  };
  const tool6: DockstoreTool = {
    defaultWDLTestParameterFile: '',
    defaultCWLTestParameterFile: '',
    default_cwl_path: '',
    default_dockerfile_path: '',
    default_wdl_path: '',
    gitUrl: '',
    mode: DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS,
    name: 'ee',
    namespace: 'aa',
    private_access: false,
    registry_string: 'quay.io',
    registry: DockstoreTool.RegistryEnum.QUAYIO,
    toolname: '1',
    tool_path: 'quay.io/aa/ee/1',
    path: 'quay.io/aa/ee',
  };

  const gitHubAppTool1: Workflow = {
    type: '',
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
    source_control_provider: 'GITHUB',
    descriptorTypeSubclass: Workflow.DescriptorTypeSubclassEnum.NA,
  };
  const gitHubAppTool2: Workflow = {
    type: '',
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
    source_control_provider: 'GITHUB',
    descriptorTypeSubclass: Workflow.DescriptorTypeSubclassEnum.NA,
  };

  const gitHubAppTool3: Workflow = {
    type: '',
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
    source_control_provider: 'GITHUB',
    descriptorTypeSubclass: Workflow.DescriptorTypeSubclassEnum.NA,
  };
  const gitHubAppTool4: Workflow = {
    type: '',
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
    source_control_provider: 'GITHUB',
    descriptorTypeSubclass: Workflow.DescriptorTypeSubclassEnum.NA,
  };
  const gitHubAppTool5: Workflow = {
    type: '',
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
    source_control_provider: 'GITHUB',
    descriptorTypeSubclass: Workflow.DescriptorTypeSubclassEnum.NA,
  };
  const gitHubAppTool6: Workflow = {
    type: '',
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
    source_control_provider: 'GITHUB',
    descriptorTypeSubclass: Workflow.DescriptorTypeSubclassEnum.NA,
  };

  const tools: DockstoreTool[] = [tool1, tool2, tool4, tool3, tool5, tool6];
  const allTools: Array<DockstoreTool | Workflow> = [
    tool1,
    tool2,
    tool4,
    tool3,
    tool5,
    tool6,
    gitHubAppTool1,
    gitHubAppTool2,
    gitHubAppTool3,
    gitHubAppTool4,
    gitHubAppTool5,
    gitHubAppTool6,
  ];
  const expectedSort: Array<DockstoreTool | Workflow> = [
    gitHubAppTool5,
    gitHubAppTool6,
    gitHubAppTool3,
    gitHubAppTool4,
    gitHubAppTool1,
    gitHubAppTool2,
    tool5,
    tool6,
    tool3,
    tool4,
    tool1,
    tool2,
  ];
  const expectedResult1: OrgToolObject<DockstoreTool> = {
    unpublished: [tool5, tool6],
    expanded: false,
    namespace: 'aa',
    registry: 'quay.io',
    published: [],
    archived: [],
  };
  const expectedResult2: OrgToolObject<DockstoreTool> = {
    unpublished: [tool3, tool4],
    expanded: false,
    namespace: 'bb',
    registry: 'quay.io',
    published: [],
    archived: [],
  };
  const expectedResult3: OrgToolObject<DockstoreTool> = {
    unpublished: [tool1, tool2],
    expanded: true,
    registry: 'quay.io',
    namespace: 'cc',
    published: [],
    archived: [],
  };
  const expectedResult: OrgToolObject<DockstoreTool>[] = [expectedResult1, expectedResult2, expectedResult3];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatSnackBarModule],
      providers: [
        MytoolsService,
        ProviderService,
        { provide: WorkflowsService, useClass: WorkflowsStubService },
        { provide: ContainerService, useClass: ContainerStubService },
        { provide: UrlResolverService, useclass: UrlResolverService },
        { provide: DateService, useClass: DateStubService },
        { provide: DescriptorLanguageService, useClass: DescriptorLanguageService },
        MyWorkflowsService,
        MyEntriesStateService,
        MyEntriesStore,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });
  it('should ...', inject([MytoolsService], (service: MytoolsService) => {
    expect(service).toBeTruthy();
  }));
  it('should convert tools to OrgToolObjects', inject([MytoolsService], (service: MytoolsService) => {
    expect(service.convertEntriesToOrgEntryObject(tools, tool1).length).toBe(3);
    expect(service.convertEntriesToOrgEntryObject(tools, tool1)).toEqual(expectedResult);
    expect(service.convertEntriesToOrgEntryObject([], tool1)).toEqual([]);
    expect(allTools.sort(service.sortEntry)).toEqual(expectedSort);
  }));
});
