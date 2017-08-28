import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';
import { DateService } from './../../shared/date.service';
import { StateService } from '../../shared/state.service';
import { VersionModalService } from '../version-modal/version-modal.service';
import { DateStubService, StateStubService, VersionModalStubService, WorkflowStubService } from './../../test/service-stubs';
import { WorkflowService } from '../../shared/workflow.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWorkflowComponent } from './view.component';

describe('ViewWorkflowComponent', () => {
  let component: ViewWorkflowComponent;
  let fixture: ComponentFixture<ViewWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewWorkflowComponent],
      providers: [
        { provide: WorkflowService, useClass: WorkflowStubService },
        { provide: VersionModalService, useClass: VersionModalStubService },
        { provide: StateService, useClass: StateStubService },
        { provide: DateService, useClass: DateStubService }
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
