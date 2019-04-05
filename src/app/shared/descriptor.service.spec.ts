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

import { DescriptorService } from './descriptor.service';
import { TestBed, inject } from '@angular/core/testing';
import { ToolDescriptor } from './swagger';
import { SourceFile } from './../shared/swagger/model/sourceFile';

describe('DescriptorService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DescriptorService],
        });
    });

    const sampleVersion = {
      'id': 135,
      'reference': 'master',
      'sourceFiles': [
          {
              'id': 136,
              'type': 'DOCKSTORE_CWL',
              'content': '',
              'path': '/Dockstore.cwl'
          },
          {
              'id': 138,
              'type': 'DOCKERFILE',
              'content': '',
              'path': '/Dockerfile'
          },
          {
              'id': 137,
              'type': 'DOCKSTORE_WDL',
              'content': '',
              'path': '/Dockstore.wdl'
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
      'workingDirectory': '',
      'last_modified': 1491599317000,
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

    it('should be created', inject([DescriptorService], (service: DescriptorService) => {
        expect(service).toBeTruthy();
    }));

    it('should get descriptors', inject([DescriptorService], (service: DescriptorService) => {
        expect(service.getDescriptors(sampleVersion)).toEqual([ToolDescriptor.TypeEnum.CWL, ToolDescriptor.TypeEnum.WDL]);
    }));
    // Tests valid cwl descriptor, but invalid wdl descriptor
  it('should get valid descriptors only', inject([DescriptorService], (service: DescriptorService) => {
    expect(service.getValidDescriptors(sampleVersion)).toEqual([ToolDescriptor.TypeEnum.CWL]);
  }));
});
