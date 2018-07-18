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

import { ParamfilesService } from '../../container/paramfiles/paramfiles.service';
import { GA4GHFilesStateService } from '../../shared/entry/GA4GHFiles.state.service';
import { GA4GHService } from '../../shared/swagger';
import { GA4GHStubService, ParamFilesStubService } from '../../test/service-stubs';
import { FilesWorkflowComponent } from './files.component';

describe('FilesWorkflowComponent', () => {
  let component: FilesWorkflowComponent;
  let fixture: ComponentFixture<FilesWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesWorkflowComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ParamfilesService, useClass: ParamFilesStubService },
        GA4GHFilesStateService,
        { provide: GA4GHService, useClass: GA4GHStubService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
