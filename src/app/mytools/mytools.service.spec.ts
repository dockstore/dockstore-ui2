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

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ContainerService } from 'app/shared/container.service';
import { CustomMaterialModule } from 'app/shared/modules/material.module';
import { MyEntriesModule } from 'app/shared/modules/my-entries.module';
import { UrlResolverService } from 'app/shared/url-resolver.service';
import { ContainerStubService } from 'app/test/service-stubs';
import { DockstoreTool } from '../shared/swagger';
import { OrgToolObject } from './my-tool/my-tool.component';
import { MytoolsService } from './mytools.service';

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
    path: 'quay.io/cc/aa'
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
    path: 'quay.io/cc/bb'
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
    path: 'quay.io/bb/cc'
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
    path: 'quay.io/bb/dd'
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
    path: 'quay.io/aa/ee'
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
    path: 'quay.io/aa/ee'
  };
  const tools: DockstoreTool[] = [tool1, tool2, tool4, tool3, tool5, tool6];
  const expectedResult1: OrgToolObject = {
    unpublished: [tool5, tool6],
    expanded: false,
    namespace: 'aa',
    registry: 'quay.io',
    published: []
  };
  const expectedResult2: OrgToolObject = {
    unpublished: [tool3, tool4],
    expanded: false,
    namespace: 'bb',
    registry: 'quay.io',
    published: []
  };
  const expectedResult3: OrgToolObject = {
    unpublished: [tool1, tool2],
    expanded: true,
    registry: 'quay.io',
    namespace: 'cc',
    published: []
  };
  const expectedResult: OrgToolObject[] = [expectedResult1, expectedResult2, expectedResult3];
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MytoolsService,
        { provide: ContainerService, useClass: ContainerStubService },
        { provide: UrlResolverService, useclass: UrlResolverService }
      ],
      imports: [RouterTestingModule, CustomMaterialModule, HttpClientTestingModule, MyEntriesModule]
    });
  });
  it('should ...', inject([MytoolsService], (service: MytoolsService) => {
    expect(service).toBeTruthy();
  }));
  it('should convert tools to OrgToolObjects', inject([MytoolsService], (service: MytoolsService) => {
    expect(service.convertToolsToOrgToolObject(tools, tool1).length).toBe(3);
    expect(service.convertToolsToOrgToolObject(tools, tool1)).toEqual(expectedResult);
    expect(service.convertToolsToOrgToolObject([], tool1)).toEqual([]);
  }));
});
