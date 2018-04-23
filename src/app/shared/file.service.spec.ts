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

import { FileService} from './file.service';
import { inject, TestBed } from '@angular/core/testing';

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


});

