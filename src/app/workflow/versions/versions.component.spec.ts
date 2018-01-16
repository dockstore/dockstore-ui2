import { RefreshService } from '../../shared/refresh.service';
import { ErrorService } from './../../shared/error.service';
import { StateService } from './../../shared/state.service';
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

import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { WorkflowService } from './../../shared/workflow.service';
import { DateService } from './../../shared/date.service';
import { DateStubService, ErrorStubService, DockstoreStubService, WorkflowStubService, WorkflowsStubService,
  StateStubService, RefreshStubService } from './../../test/service-stubs';
import { DockstoreService } from './../../shared/dockstore.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderBy } from '../../shared/orderBy';

import { VersionsWorkflowComponent } from './versions.component';

describe('VersionsWorkflowComponent', () => {
  let component: VersionsWorkflowComponent;
  let fixture: ComponentFixture<VersionsWorkflowComponent>;
  let workflowService: WorkflowService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VersionsWorkflowComponent, OrderBy ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [DockstoreService,
        { provide: DateService, useClass: DateStubService},
        { provide: WorkflowService, useClass: WorkflowStubService},
        { provide: WorkflowsService, useClass: WorkflowsStubService},
        StateService,
        { provide: ErrorService, useClass: ErrorStubService },
        { provide: RefreshService, useClass: RefreshStubService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionsWorkflowComponent);
    component = fixture.componentInstance;
    component.versions = [];
    fixture.detectChanges();
    workflowService = fixture.debugElement.injector.get(WorkflowService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should update default version and then set current workflow based on response', () => {
    const workflowVersion: WorkflowVersion = {id: 5, reference: 'stuff', name: 'name'};
    component.publicPage = false;
    component.updateDefaultVersion('name');
    fixture.detectChanges();
    workflowService.workflow$.subscribe(workflow => {
      expect(workflow).toEqual(jasmine.objectContaining({defaultVersion: 'name'}));
  });
  });

  it('should get verified source', () => {
    const source1 = {version: '1', verifiedSource: 'a'};
    const source2 = {version: '2', verifiedSource: 'b'};
    const source3 = {version: '3', verifiedSource: 'c'};
    component.verifiedSource = [source1, source2, source3];
    fixture.detectChanges();
    expect(component.getVerifiedSource('1')).toEqual('a');
    expect(component.getVerifiedSource('2')).toEqual('b');
    expect(component.getVerifiedSource('3')).toEqual('c');
    expect(component.getVerifiedSource('4')).toEqual('');
  });
});
