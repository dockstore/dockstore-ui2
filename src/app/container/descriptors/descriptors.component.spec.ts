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
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ContainersStubService, ContainerStubService, EntryStubService, GA4GHV20StubService } from '../../../../src/app/test/service-stubs';
import { ContainerService } from '../../shared/container.service';
import { DescriptorService } from '../../shared/descriptor.service';
import { FileService } from '../../shared/file.service';
import { EntriesService, GA4GHV20Service } from '../../shared/openapi';
import { ContainersService } from '../../shared/swagger';
import { sampleToolVersion } from '../../test/mocked-objects';
import { DescriptorsComponent } from './descriptors.component';
import { DescriptorLanguageService } from '../../shared/entry/descriptor-language.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DescriptorsComponent', () => {
  let component: DescriptorsComponent;
  let fixture: ComponentFixture<DescriptorsComponent>;

  class FileStubService {}
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DescriptorsComponent],
        imports: [HttpClientModule, MatSnackBarModule, HttpClientTestingModule],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          DescriptorService,
          { provide: ContainersService, useClass: ContainersStubService },
          { provide: ContainerService, useClass: ContainerStubService },
          { provide: FileService, useClass: FileStubService },
          { provide: GA4GHV20Service, useClass: GA4GHV20StubService },
          { provide: EntriesService, useClass: EntryStubService },
          { provide: DescriptorLanguageService, useClass: DescriptorLanguageService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptorsComponent);
    component = fixture.componentInstance;
    component.id = 5;
    component.selectedVersion = sampleToolVersion;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
