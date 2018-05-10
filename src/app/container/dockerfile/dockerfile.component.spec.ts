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

import { ContainersService } from '../../shared/swagger';
import { ContainerService } from './../../shared/container.service';
import { FileStubService, ContainerStubService, ContainersStubService } from './../../test/service-stubs';
import { FileService } from './../../shared/file.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { DockerfileComponent } from './dockerfile.component';
class DockerFileStubService { }

describe('DockerfileComponent', () => {
  let component: DockerfileComponent;
  let fixture: ComponentFixture<DockerfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DockerfileComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: FileService, useClass: FileStubService },
        { provide: ContainerService, useClass: ContainerStubService },
        { provide: ContainersService, useClass: ContainersStubService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DockerfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
