import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { WorkflowService } from './../../shared/workflow.service';
import { DateService } from './../../shared/date.service';
import { DateStubService, DockstoreStubService, WorkflowStubService, WorkflowsStubService } from './../../test/service-stubs';
import { DockstoreService } from './../../shared/dockstore.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionsWorkflowComponent } from './versions.component';

describe('VersionsWorkflowComponent', () => {
  let component: VersionsWorkflowComponent;
  let fixture: ComponentFixture<VersionsWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VersionsWorkflowComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: DockstoreService, useClass: DockstoreStubService },
        { provide: DateService, useClass: DateStubService},
        { provide: WorkflowService, useClass: WorkflowStubService},
        { provide: WorkflowsService, useClass: WorkflowsStubService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionsWorkflowComponent);
    component = fixture.componentInstance;
    component.versions = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
