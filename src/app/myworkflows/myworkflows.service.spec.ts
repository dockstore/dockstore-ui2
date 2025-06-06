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
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { EntryTypeMetadataService } from 'app/entry/type-metadata/entry-type-metadata.service';
import { UsersService, WorkflowsService } from 'app/shared/openapi';
import { WorkflowService } from 'app/shared/state/workflow.service';
import { UrlResolverService } from 'app/shared/url-resolver.service';
import {
  DateStubService,
  EntryTypeMetadataStubService,
  ProviderStubService,
  UrlResolverStubService,
  UsersStubService,
  WorkflowsStubService,
  WorkflowStubService,
} from 'app/test/service-stubs';
import { DateService } from '../shared/date.service';
import { ProviderService } from '../shared/provider.service';
import { MyEntriesStateService } from '../shared/state/my-entries.service';
import { MyEntriesStore } from '../shared/state/my-entries.store';
import { Workflow } from './../shared/openapi/model/workflow';
import { OrgWorkflowObject } from './my-workflow/my-workflow.component';
import { MyWorkflowsService } from './myworkflows.service';

describe('MyWorkflowsService', () => {
  const tool1: Workflow = {
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
  const tool2: Workflow = {
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
  const tool3: Workflow = {
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
  const tool4: Workflow = {
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
  const tool5: Workflow = {
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
  const tool6: Workflow = {
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
  const tools: Workflow[] = [tool1, tool2, tool4, tool3, tool5, tool6];
  const expectedResult1: OrgWorkflowObject<Workflow> = {
    unpublished: [tool5, tool6],
    published: [],
    archived: [],
    expanded: false,
    sourceControl: 'github.com',
    organization: 'aa',
  };
  const expectedResult2: OrgWorkflowObject<Workflow> = {
    unpublished: [tool3, tool4],
    published: [],
    archived: [],
    expanded: false,
    sourceControl: 'github.com',
    organization: 'bb',
  };
  const expectedResult3: OrgWorkflowObject<Workflow> = {
    unpublished: [tool1, tool2],
    published: [],
    archived: [],
    expanded: true,
    sourceControl: 'github.com',
    organization: 'cc',
  };
  const expectedResult: OrgWorkflowObject<Workflow>[] = [expectedResult1, expectedResult2, expectedResult3];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatSnackBarModule, MatDialogModule],
      providers: [
        { provide: DateService, useClass: DateStubService },
        { provide: UrlResolverService, useClass: UrlResolverStubService },
        { provide: WorkflowService, useClass: WorkflowStubService },
        { provide: UsersService, useClass: UsersStubService },
        { provide: WorkflowsService, useClass: WorkflowsStubService },
        { provide: EntryTypeMetadataService, useClass: EntryTypeMetadataStubService },
        { provide: ProviderService, useClass: ProviderStubService },
        MyEntriesStateService,
        MyEntriesStore,
      ],
    });
  });
  it('should be truthy', inject([MyWorkflowsService], (service: MyWorkflowsService) => {
    expect(service).toBeTruthy();
  }));
  it('should convert workflows to OrgWorkflowObjects', inject([MyWorkflowsService], (service: MyWorkflowsService) => {
    expect(service.convertEntriesToOrgEntryObject(tools, tool1).length).toBe(3);
    expect(service.convertEntriesToOrgEntryObject(tools, tool1)).toEqual(expectedResult);
    expect(service.convertEntriesToOrgEntryObject([], tool1)).toEqual([]);

    const orgNotInExistingTools = 'foobar';
    const convertedEntries = service.convertEntriesToOrgEntryObject(tools, tool1, [orgNotInExistingTools]);
    expect(convertedEntries.length).toBe(4);
    const emptyOrgObject = convertedEntries.find((e) => e.organization === orgNotInExistingTools);
    expect(emptyOrgObject.published.length).toBe(0);
    expect(emptyOrgObject.unpublished.length).toBe(0);
    expect(service.convertEntriesToOrgEntryObject(tools, tool1, [orgNotInExistingTools, tool1.organization]).length).toBe(4);
  }));
});
