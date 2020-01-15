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

import { ContainersStubService, ContainerStubService, GA4GHStubService } from '../../../../src/app/test/service-stubs';
import { ContainerService } from '../../shared/container.service';
import { DescriptorService } from '../../shared/descriptor.service';
import { FileService } from '../../shared/file.service';
import { ContainersService, GA4GHService } from '../../shared/swagger';
import { DescriptorsComponent } from './descriptors.component';

describe('DescriptorsComponent', () => {
  let component: DescriptorsComponent;
  let fixture: ComponentFixture<DescriptorsComponent>;

  class HttpStubService {}
  class FileStubService {}
  class HttpStub {}
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DescriptorsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        DescriptorService,
        { provide: ContainersService, useClass: ContainersStubService },
        { provide: ContainerService, useClass: ContainerStubService },
        { provide: FileService, useClass: FileStubService },
        { provide: GA4GHService, useClass: GA4GHStubService }
      ]
    }).compileComponents();
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
