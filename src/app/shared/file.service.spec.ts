/*
 *    Copyright 2018 OICR
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

import { sampleSourceFile, sampleTag } from '../test/mocked-objects';
import { ga4ghPath } from './constants';
import { Dockstore } from './dockstore.model';
import { FileService } from './file.service';
import { ToolDescriptor } from './swagger';

describe('FileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileService],
    });
  });

  it('should get descriptor path', inject([FileService], (fileService: FileService) => {
    const tag = sampleTag;
    const sourceFile = sampleSourceFile;
    const descriptorType = ToolDescriptor.TypeEnum.CWL;
    const entryType = 'tool';
    const url = fileService.getDescriptorPath('quay.io/org/repo', tag, sourceFile, descriptorType, entryType);
    expect(url).toEqual(Dockstore.API_URI + ga4ghPath + '/tools/quay.io%2Forg%2Frepo/versions/sampleName/PLAIN-CWL/descriptor//cwl.json');
  }));
});
