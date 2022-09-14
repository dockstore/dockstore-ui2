import { RefreshService } from './../../shared/refresh.service';
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
import { ToolDescriptor } from './../../shared/swagger';
import { ContainersService } from './../../shared/swagger/api/containers.service';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { SourceFile } from './../../shared/swagger/model/sourceFile';
import { Tag } from './../../shared/swagger/model/tag';
import { ContainersStubService, RefreshStubService, WorkflowsStubService } from './../../test/service-stubs';
import { ParamfilesService } from './paramfiles.service';
import { DescriptorLanguageService } from '../../shared/entry/descriptor-language.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Service: paramFiles.service.ts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ParamfilesService,
        { provide: WorkflowsService, useClass: WorkflowsStubService },
        { provide: ContainersService, useClass: ContainersStubService },
        { provide: RefreshService, useClass: RefreshStubService },
        { provide: DescriptorLanguageService, useClass: DescriptorLanguageService },
      ],
    });
  });

  const tag1: Tag = {
    id: 131,
    reference: 'master',
    hidden: false,
    valid: true,
    name: 'master',
    dirtyBit: false,
    verified: false,
    verifiedSource: null,
    size: 50430898,
    automated: true,
    image_id: '5f01c6b7ae8f6ba7701aa30b6643866c2ff6166a8f2221844840f46d636e1ed3',
    dockerfile_path: '/Dockerfile',
    cwl_path: '/Dockstore.cwl',
    wdl_path: '/Dockstore.wdl',
  };
  const tag2: Tag = {
    id: 132,
    reference: 'master',
    hidden: false,
    valid: true,
    name: 'latest',
    dirtyBit: false,
    verified: false,
    verifiedSource: null,
    size: 50430898,
    automated: true,
    image_id: '5f01c6b7ae8f6ba7701aa30b6643866c2ff6166a8f2221844840f46d636e1ed3',
    dockerfile_path: '/Dockerfile',
    cwl_path: '/Dockstore.cwl',
    wdl_path: '/Dockstore.wdl',
  };

  const tag3: Tag = {
    id: 132,
    reference: 'master',
    hidden: false,
    valid: true,
    name: 'latest',
    dirtyBit: false,
    verified: false,
    verifiedSource: null,
    size: 50430898,
    automated: true,
    image_id: '5f01c6b7ae8f6ba7701aa30b6643866c2ff6166a8f2221844840f46d636e1ed3',
    dockerfile_path: '/Dockerfile',
    cwl_path: '/Dockstore.cwl',
    wdl_path: '/Dockstore.wdl',
    validations: [
      {
        id: 1,
        type: SourceFile.TypeEnum.DOCKERFILE,
        valid: true,
        message: '{}',
      },
      {
        id: 2,
        type: SourceFile.TypeEnum.DOCKSTORECWL,
        valid: true,
        message: '{}',
      },
      {
        id: 3,
        type: SourceFile.TypeEnum.DOCKSTOREWDL,
        valid: false,
        message: '{"/Dockstore.wdl":"Primary WDL descriptor is not present."}',
      },
      {
        id: 4,
        type: SourceFile.TypeEnum.WDLTESTJSON,
        valid: true,
        message: '{}',
      },
      {
        id: 5,
        type: SourceFile.TypeEnum.CWLTESTJSON,
        valid: true,
        message: '{}',
      },
    ],
  };

  const tag1FileTypes: Array<SourceFile.TypeEnum> = ['DOCKERFILE', 'DOCKSTORE_CWL', 'DOCKSTORE_WDL'];
  const tag2FileTypes: Array<SourceFile.TypeEnum> = ['DOCKERFILE', 'DOCKSTORE_CWL', 'DOCKSTORE_WDL', 'CWL_TEST_JSON'];
  const tag3FileTypes: Array<SourceFile.TypeEnum> = ['DOCKERFILE', 'DOCKSTORE_CWL', 'DOCKSTORE_WDL', 'WDL_TEST_JSON', 'CWL_TEST_JSON'];

  it('should ...', inject([ParamfilesService], (service: ParamfilesService) => {
    expect(service).toBeTruthy();
  }));
  it('should get workflow test parameter files from swagger workflowsService', inject([ParamfilesService], (service: ParamfilesService) => {
    service.getFiles(1, 'workflows', 'develop', 'CWL').subscribe((files) => {
      expect(files).toEqual([]);
    });
  }));
  it('should get tool test parameter files from swagger containersService', inject([ParamfilesService], (service: ParamfilesService) => {
    service.getFiles(1, 'containers', 'develop', 'CWL').subscribe((files) => {
      expect(files).toEqual([]);
    });
  }));
  // Tests valid cwl descriptor and test file, but invalid wdl descriptor and valid wdl test file
  it('should get descriptors', inject([ParamfilesService], (service: ParamfilesService) => {
    expect(service.getDescriptors(tag1FileTypes)).toEqual([]);
    expect(service.getDescriptors(tag2FileTypes)).toEqual([ToolDescriptor.TypeEnum.CWL]);
    expect(service.getDescriptors(tag3FileTypes)).toEqual([ToolDescriptor.TypeEnum.WDL, ToolDescriptor.TypeEnum.CWL]);
  }));
  it('should get valid descriptors with parameter files', inject([ParamfilesService], (service: ParamfilesService) => {
    expect(service.getValidDescriptors(tag1, tag3FileTypes)).toEqual([]);
    expect(service.getValidDescriptors(tag2, tag3FileTypes)).toEqual([]);
    expect(service.getValidDescriptors(tag3, tag3FileTypes)).toEqual([ToolDescriptor.TypeEnum.CWL]);
  }));
});
