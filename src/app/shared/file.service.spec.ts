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

import { Dockstore } from './dockstore.model';
import { FileService} from './file.service';
import { inject, TestBed } from '@angular/core/testing';
import { SourceFile } from './swagger';
import { sampleTag, sampleSourceFile } from '../test/mocked-objects';
import { ga4ghPath } from './constants';

describe('FileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileService],
    });
  });

  it('should escape correctly', inject([FileService], (fileService: FileService) => {
    expect(fileService.escapeEntities('python <<CODE')).toEqual('python &lt;&lt;CODE');
    expect(fileService.escapeEntities('hello')).toEqual('hello');
    expect(fileService.escapeEntities('<danger>Thing\'s & "things"</danger>'))
      .toEqual('&lt;danger&gt;Thing&#039;s &amp; &quot;things&quot;&lt;/danger&gt;');
    expect(fileService.escapeEntities('')).toEqual('');
    expect(fileService.escapeEntities(null)).toEqual(null);
  }));
  it('should get descriptor path', inject([FileService], (fileService: FileService) => {
    const tag = sampleTag;
    const sourceFile = sampleSourceFile;
    const descriptorType = 'cwl';
    const entryType = 'tool';
    const url = fileService.getDescriptorPath('quay.io/org/repo', tag, sourceFile, descriptorType, entryType);
    expect(url).toEqual(Dockstore.API_URI + ga4ghPath + '/tools/quay.io%2Forg%2Frepo/versions/sampleName/PLAIN-CWL/descriptor//cwl.json');
  }));
});

