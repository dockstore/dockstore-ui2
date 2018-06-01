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

import { PathService } from '../../shared/path.service';
import { RefreshService } from './../../shared/refresh.service';
import { ContainersService } from './../../shared/swagger/api/containers.service';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { SourceFile } from './../../shared/swagger/model/sourceFile';
import { Tag } from './../../shared/swagger/model/tag';
import { ContainersStubService, RefreshStubService, WorkflowsStubService } from './../../test/service-stubs';
import { ParamfilesService } from './paramfiles.service';

describe('Service: paramFiles.service.ts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParamfilesService,
        { provide: WorkflowsService, useClass: WorkflowsStubService },
        { provide: ContainersService, useClass: ContainersStubService },
        { provide: RefreshService, useClass: RefreshStubService },
        PathService
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
        'path': '/Dockstore.wdl'
      },
      {
        'id': 273,
        'type': SourceFile.TypeEnum.DOCKERFILE,
        'content': '',
        'path': '/Dockerfile'
      },
      {
        'id': 271,
        'type': SourceFile.TypeEnum.DOCKSTORECWL,
        'content': '',
        'path': '/Dockstore.cwl'
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
        'path': '/Dockerfile'
      },
      {
        'id': 275,
        'type': SourceFile.TypeEnum.DOCKSTOREWDL,
        'content': '',
        'path': '/Dockstore.wdl'
      },
      {
        'id': 274,
        'type': SourceFile.TypeEnum.DOCKSTORECWL,
        'content': '',
        'path': '/Dockstore.cwl'
      },
      {
        'id': 277,
        'type': SourceFile.TypeEnum.CWLTESTJSON,
        'content': '',
        'path': '/test.json'
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
        'path': '/Dockerfile'
      },
      {
        'id': 275,
        'type': SourceFile.TypeEnum.DOCKSTOREWDL,
        'content': '',
        'path': '/Dockstore.wdl'
      },
      {
        'id': 274,
        'type': SourceFile.TypeEnum.DOCKSTORECWL,
        'content': '',
        'path': '/Dockstore.cwl'
      },
      {
        'id': 277,
        'type': SourceFile.TypeEnum.WDLTESTJSON,
        'content': '',
        'path': '/test.json'
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
});
