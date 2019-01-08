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

import { Tag } from './../../shared/swagger/model/tag';
import { SourceFile } from './../../shared/swagger/model/sourceFile';
import { ContainersService } from './../../shared/swagger/api/containers.service';
import { WorkflowsStubService, ContainersStubService, RefreshStubService } from './../../test/service-stubs';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { ParamfilesService } from './paramfiles.service';
import { TestBed, async, inject } from '@angular/core/testing';
import { ToolDescriptor } from './../../shared/swagger';

describe('Service: paramFiles.service.ts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParamfilesService,
        { provide: WorkflowsService, useClass: WorkflowsStubService },
        { provide: ContainersService, useClass: ContainersStubService },
        { provide: RefreshService, useClass: RefreshStubService }
      ]
    });
  });

  const tag1: Tag = {
    'id': 131,
    'reference': 'master',
    'sourceFiles': [
      {
        'id': 272,
        'type': SourceFile.TypeEnum.DOCKSTOREWDL,
        'content': '',
        'path': '/Dockstore.wdl',
        'absolutePath': '/Dockstore.wdl'
      },
      {
        'id': 273,
        'type': SourceFile.TypeEnum.DOCKERFILE,
        'content': '',
        'path': '/Dockerfile',
        'absolutePath': '/Dockerfile'
      },
      {
        'id': 271,
        'type': SourceFile.TypeEnum.DOCKSTORECWL,
        'content': '',
        'path': '/Dockstore.cwl',
        'absolutePath': '/Dockstore.cwl'
      }
    ],
    'hidden': false,
    'valid': true,
    'name': 'master',
    'dirtyBit': false,
    'verified': false,
    'verifiedSource': null,
    'size': 50430898,
    'automated': true,
    'image_id': '5f01c6b7ae8f6ba7701aa30b6643866c2ff6166a8f2221844840f46d636e1ed3',
    'dockerfile_path': '/Dockerfile',
    'cwl_path': '/Dockstore.cwl',
    'wdl_path': '/Dockstore.wdl'
  };
  const tag2: Tag = {
    'id': 132,
    'reference': 'master',
    'sourceFiles': [
      {
        'id': 276,
        'type': SourceFile.TypeEnum.DOCKERFILE,
        'content': '',
        'path': '/Dockerfile',
        'absolutePath': '/Dockerfile'
      },
      {
        'id': 275,
        'type': SourceFile.TypeEnum.DOCKSTOREWDL,
        'content': '',
        'path': '/Dockstore.wdl',
        'absolutePath': '/Dockstore.wdl'
      },
      {
        'id': 274,
        'type': SourceFile.TypeEnum.DOCKSTORECWL,
        'content': '',
        'path': '/Dockstore.cwl',
        'absolutePath': '/Dockstore.cwl'
      },
      {
        'id': 277,
        'type': SourceFile.TypeEnum.CWLTESTJSON,
        'content': '',
        'path': '/test.json',
        'absolutePath': '/test.json'
      }
    ],
    'hidden': false,
    'valid': true,
    'name': 'latest',
    'dirtyBit': false,
    'verified': false,
    'verifiedSource': null,
    'size': 50430898,
    'automated': true,
    'image_id': '5f01c6b7ae8f6ba7701aa30b6643866c2ff6166a8f2221844840f46d636e1ed3',
    'dockerfile_path': '/Dockerfile',
    'cwl_path': '/Dockstore.cwl',
    'wdl_path': '/Dockstore.wdl'
  };

  const tag3: Tag = {
    'id': 132,
    'reference': 'master',
    'sourceFiles': [
      {
        'id': 276,
        'type': SourceFile.TypeEnum.DOCKERFILE,
        'content': '',
        'path': '/Dockerfile',
        'absolutePath': '/Dockerfile'
      },
      {
        'id': 275,
        'type': SourceFile.TypeEnum.DOCKSTOREWDL,
        'content': '',
        'path': '/Dockstore.wdl',
        'absolutePath': '/Dockstore.wdl'
      },
      {
        'id': 274,
        'type': SourceFile.TypeEnum.DOCKSTORECWL,
        'content': '',
        'path': '/Dockstore.cwl',
        'absolutePath': '/Dockstore.cwl'
      },
      {
        'id': 278,
        'type': SourceFile.TypeEnum.CWLTESTJSON,
        'content': '',
        'path': '/Dockstore.wdl',
        'absolutePath': '/Dockstore.wdl'
      },
      {
        'id': 277,
        'type': SourceFile.TypeEnum.WDLTESTJSON,
        'content': '',
        'path': '/test.json',
        'absolutePath': '/test.json'
      }
    ],
    'hidden': false,
    'valid': true,
    'name': 'latest',
    'dirtyBit': false,
    'verified': false,
    'verifiedSource': null,
    'size': 50430898,
    'automated': true,
    'image_id': '5f01c6b7ae8f6ba7701aa30b6643866c2ff6166a8f2221844840f46d636e1ed3',
    'dockerfile_path': '/Dockerfile',
    'cwl_path': '/Dockstore.cwl',
    'wdl_path': '/Dockstore.wdl',
    'validations': [
      {
        'id': 1,
        'type': SourceFile.TypeEnum.DOCKERFILE,
        'valid': true,
        'message': '{}'
      },
      {
        'id': 2,
        'type': SourceFile.TypeEnum.DOCKSTORECWL,
        'valid': true,
        'message': '{}'
      },
      {
        'id': 3,
        'type': SourceFile.TypeEnum.DOCKSTOREWDL,
        'valid': false,
        'message': '{"/Dockstore.wdl":"Primary WDL descriptor is not present."}'
      },
      {
        'id': 4,
        'type': SourceFile.TypeEnum.WDLTESTJSON,
        'valid': true,
        'message': '{}'
      },
      {
        'id': 5,
        'type': SourceFile.TypeEnum.CWLTESTJSON,
        'valid': true,
        'message': '{}'
      }
    ]
  };

  const versions: Tag[] = [tag1, tag2, tag3];

  it('should ...', inject([ParamfilesService], (service: ParamfilesService) => {
    expect(service).toBeTruthy();
  }));
  it('should get workflow test parameter files from swagger workflowsService', inject([ParamfilesService], (service: ParamfilesService) => {
    service.getFiles(1, 'workflows', 'develop', 'CWL').subscribe(files => {
      expect(files).toEqual([]);
    });
  }));
  it('should get tool test parameter files from swagger containersService', inject([ParamfilesService], (service: ParamfilesService) => {
    service.getFiles(1, 'containers', 'develop', 'CWL').subscribe(files => {
      expect(files).toEqual([]);
    });
  }));
  it('should get descriptors with parameter files', inject([ParamfilesService], (service: ParamfilesService) => {
    expect(service.getVersions(versions)).toEqual([tag2, tag3]);
  }));
  // Tests valid cwl descriptor and test file, but invalid wdl descriptor and valid wdl test file
  it('should get valid descriptors with parameter files', inject([ParamfilesService], (service: ParamfilesService) => {
    expect(service.getValidDescriptors(tag3)).toEqual([ToolDescriptor.TypeEnum.CWL]);
  }));
});
