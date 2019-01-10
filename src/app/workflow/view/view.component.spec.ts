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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateService } from '../../shared/date.service';
import { WorkflowsService } from '../../shared/swagger';
import { HostedService } from '../../shared/swagger/api/hosted.service';
import { WorkflowVersion } from '../../shared/swagger/model/workflowVersion';
import {
  DateStubService,
  HostedStubService,
  VersionModalStubService,
  WorkflowsStubService,
  WorkflowStubService,
} from '../../test/service-stubs';
import { VersionModalService } from '../version-modal/version-modal.service';
import { ViewWorkflowComponent } from './view.component';
import { WorkflowService } from '../../shared/state/workflow.service';
import { MatDialogModule } from '@angular/material';

describe('ViewWorkflowComponent', () => {
  let component: ViewWorkflowComponent;
  let fixture: ComponentFixture<ViewWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [ViewWorkflowComponent],
      providers: [
        { provide: WorkflowService, useClass: WorkflowStubService },
        { provide: VersionModalService, useClass: VersionModalStubService },
        { provide: WorkflowsService, useClass: WorkflowsStubService},
        { provide: DateService, useClass: DateStubService },
        { provide: HostedService, useClass: HostedStubService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewWorkflowComponent);
    component = fixture.componentInstance;
    const workflowVersion: WorkflowVersion = {id: 5, reference: 'stuff', name: 'name'};
    component.version = workflowVersion;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
