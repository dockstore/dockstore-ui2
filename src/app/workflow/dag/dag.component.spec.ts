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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { WorkflowService } from '../../shared/state/workflow.service';
import { WorkflowsService } from '../../shared/swagger/api/workflows.service';
import { DagStubService, WorkflowsStubService, WorkflowStubService } from '../../test/service-stubs';
import { CwlViewerComponent } from './cwl-viewer/cwl-viewer.component';
import { DagComponent } from './dag.component';
import { DagQuery } from './state/dag.query';
import { DagStore } from './state/dag.store';

describe('DagComponent', () => {
  let component: DagComponent;
  let fixture: ComponentFixture<DagComponent>;
  let dagQuery: DagQuery;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DagComponent, CwlViewerComponent],
        imports: [HttpClientTestingModule, FormsModule],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          DagStore,
          DagQuery,
          { provide: WorkflowsService, useClass: WorkflowsStubService },
          { provide: WorkflowService, useClass: WorkflowStubService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DagComponent);
    component = fixture.componentInstance;
    dagQuery = TestBed.inject(DagQuery);
    // Mocking services that are injected inside the component
    (component as any).dagService = new DagStubService();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dagQuery should return determine whether the dagResults are missing tools', () => {
    expect(dagQuery.isMissingTool(null)).toBeTruthy();
    expect(dagQuery.isMissingTool({ edges: [], nodes: [] })).toBeTruthy();
    expect(dagQuery.isMissingTool({ edges: [1], nodes: [1] })).toBeFalsy();
  });
});
