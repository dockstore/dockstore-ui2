import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchThirdPartyComponent } from './launch-third-party.component';
import { WorkflowsService } from '../../shared/swagger/api/workflows.service';
import { WorkflowsStubService, WorkflowStubService, WorkflowVersionStubService } from '../../test/service-stubs';
import { Workflow, WorkflowVersion } from '../../shared/swagger';
import { Observable } from 'rxjs/Observable';
import { wdlSourceFile } from '../../test/mocked-objects';

describe('LaunchThirdPartyComponent', () => {
  let component: LaunchThirdPartyComponent;
  let fixture: ComponentFixture<LaunchThirdPartyComponent>;
  let workflowVersion: WorkflowVersion;
  let workflow: Workflow;
  let workflowsService: WorkflowsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaunchThirdPartyComponent ],
      providers: [
        { provide: WorkflowsService, useClass: WorkflowsStubService},
        { provide: WorkflowVersion, useClass: WorkflowVersionStubService},
        { provide: Workflow, useClass: WorkflowStubService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchThirdPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    workflowVersion = TestBed.get(WorkflowVersion);
    workflow = TestBed.get(Workflow);
    workflowsService = TestBed.get(WorkflowsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not set urls if CWL', () => {
    spyOnProperty(workflowVersion, 'name', 'get').and.returnValue('master');
    component.selectedVersion = workflowVersion;
    spyOnProperty(workflow, 'full_workflow_path', 'get').and
      .returnValue('github.com/DataBiosphere/topmed-workflows/Functional_Equivalence');
    spyOnProperty(workflow, 'descriptorType', 'get').and.returnValue('cwl');
    expect(component.dnastackURL).toBeFalsy();
    expect(component.fireCloudURL).toBeFalsy();
  });

  it('should set urls if WDL with no secondary files', () => {
    spyOnProperty(workflowVersion, 'name', 'get').and.returnValue('master');
    component.selectedVersion = workflowVersion;
    spyOnProperty(workflow, 'full_workflow_path', 'get').and
      .returnValue('github.com/DataBiosphere/topmed-workflows/Functional_Equivalence');
    spyOnProperty(workflow, 'descriptorType', 'get').and.returnValue('wdl');
    spyOn(workflowsService, 'wdl').and.returnValue(Observable.of(wdlSourceFile));
    component.workflow = workflow;
    expect(component.dnastackURL)
      // tslint:disable-next-line:max-line-length
      .toEqual('https://app.dnastack.com/#/app/workflow/import/dockstore?path=github.com/DataBiosphere/topmed-workflows/Functional_Equivalence&descriptorType=wdl');
    expect(component.fireCloudURL)
      // tslint:disable-next-line:max-line-length
      .toEqual('https://portal.firecloud.org/#import/dockstore/github.com/DataBiosphere/topmed-workflows/Functional_Equivalence:master');
  });

  it('should set dnastack but not Firecloud if WDL with secondary files', () => {
    spyOnProperty(workflowVersion, 'name', 'get').and.returnValue('master');
    component.selectedVersion = workflowVersion;
    spyOnProperty(workflow, 'full_workflow_path', 'get').and
      .returnValue('github.com/DataBiosphere/topmed-workflows/Functional_Equivalence');
    spyOnProperty(workflow, 'descriptorType', 'get').and.returnValue('wdl');
    spyOn(workflowsService, 'wdl').and.returnValue(Observable.of(wdlSourceFile));
    spyOn(workflowsService, 'secondaryWdl').and.returnValue(Observable.of([wdlSourceFile]));
    component.workflow = workflow;
    expect(component.dnastackURL)
      // tslint:disable-next-line:max-line-length
      .toEqual('https://app.dnastack.com/#/app/workflow/import/dockstore?path=github.com/DataBiosphere/topmed-workflows/Functional_Equivalence&descriptorType=wdl');
    expect(component.fireCloudURL).toBeFalsy();
  });
});
