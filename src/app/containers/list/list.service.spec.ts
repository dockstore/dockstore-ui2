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

import { ListContainersService } from './list.service';
import { TestBed, inject } from '@angular/core/testing';

describe('listService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListContainersService]
    });
  });
  it('should ...', inject([ListContainersService], (service: ListContainersService) => {
    expect(service).toBeTruthy();
  }));
  it('should ...', inject([ListContainersService], (service: ListContainersService) => {
    expect(service.getDockerPullCmd('registry.hub.docker.com/a/b')).toBe('docker pull a/b');
    expect(service.getDockerPullCmd('quay.io/a/b')).toBe('docker pull quay.io/a/b');
    expect(service.getDockerPullCmd('quay.io/a/b', 'version')).toBe('docker pull quay.io/a/b:version');
    expect(service.getDockerPullCmd('quay.io/a_/b', 'version')).toBe('docker pull quay.io/ab:version');
  }));
});
