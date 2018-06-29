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

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { ContainersStubService, ContainerStubService } from '../../../../src/app/test/service-stubs';
import { ContainersService } from '../../shared/swagger';
import { ContainerService } from './../../shared/container.service';
import { FileService } from './../../shared/file.service';
import { DescriptorsComponent } from './descriptors.component';
import { ToolDescriptorService } from './tool-descriptor.service';

describe('DescriptorsComponent', () => {
  let component: DescriptorsComponent;
  let fixture: ComponentFixture<DescriptorsComponent>;

  class HttpStubService { }
  class FileStubService { }
  class HttpStub { }
  class DescriptorsStubService {
    getFiles(descriptor): Observable<any> {
      return null;
    }
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DescriptorsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ToolDescriptorService, useClass: DescriptorsStubService },
        { provide: ContainersService, useClass: ContainersStubService },
        { provide: ContainerService, useClass: ContainerStubService },
        { provide: FileService, useClass: FileStubService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptorsComponent);
    component = fixture.componentInstance;
    component.id = 5;
    component.selectedVersion = null;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
