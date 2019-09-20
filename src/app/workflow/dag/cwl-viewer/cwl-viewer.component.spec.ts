import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { WorkflowService } from '../../../shared/state/workflow.service';
import { CwlViewerComponent } from './cwl-viewer.component';
import { DockstoreService } from '../../../shared/dockstore.service';
import { DateService } from '../../../shared/date.service';
import { ProviderService } from '../../../shared/provider.service';
import { sampleCwlExtendedWorkflow, sampleWdlWorkflow1, sampleWorkflowVersion } from '../../../test/mocked-objects';

describe('cwl-viewerComponent', () => {
  let component: CwlViewerComponent;
  let fixture: ComponentFixture<CwlViewerComponent>;
  let workflowService: WorkflowService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CwlViewerComponent],
      imports: [HttpClientTestingModule, FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [DockstoreService, DateService, ProviderService, WorkflowService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwlViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([WorkflowService], svc => {
    workflowService = svc;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get providerUrl of extended workflow', () => {
    component.extendedWorkflow = sampleCwlExtendedWorkflow;
    workflowService.setWorkflow(sampleCwlExtendedWorkflow);
    component.selectedVersion = sampleWorkflowVersion;
    component.ngOnChanges();
    expect(component.extendedWorkflow.providerUrl).toEqual('https://github.com/dockstore-testing/md5sum-checker');
  });
});
