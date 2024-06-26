import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DateService } from '../../../shared/date.service';
import { DockstoreService } from '../../../shared/dockstore.service';
import { ProviderService } from '../../../shared/provider.service';
import { WorkflowService } from '../../../shared/state/workflow.service';
import { sampleCwlExtendedWorkflow, sampleWorkflowVersion } from '../../../test/mocked-objects';
import { CwlViewerComponent } from './cwl-viewer.component';
import { DescriptorLanguageService } from '../../../shared/entry/descriptor-language.service';

describe('cwl-viewerComponent', () => {
  let component: CwlViewerComponent;
  let fixture: ComponentFixture<CwlViewerComponent>;
  let workflowService: WorkflowService;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, FormsModule, HttpClientTestingModule, CwlViewerComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [DockstoreService, DateService, ProviderService, WorkflowService, DescriptorLanguageService],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CwlViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([WorkflowService], (svc) => {
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
